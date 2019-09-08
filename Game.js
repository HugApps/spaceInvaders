import React from 'react';
import { StyleSheet, Text, View, Dimensions, StatusBar, Alert } from 'react-native';
import SpaceShip from './Entities/SpaceShip';
import ProjectTile from './Entities/Projectile';
import Asteroid from './Entities/Asteriod';
import { GameEngine, GameLoop, } from "react-native-game-engine";
import Matter from "matter-js";
import Asteriod from './Entities/Asteriod';
//360x640
Matter.Common.isElement = () => false;
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
const engine = Matter.Engine.create({ enableSleeping: false });
engine.world.gravity.y = 0;
const world = engine.world;
const RADIUS = 25;



export default class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gameStopped: false,
      score: 0
    }
    this.state = {
      x: WIDTH / 2 - RADIUS,
      y: HEIGHT / 2 - RADIUS,
      delay: 30,
      time: 0,
    };
    this.updateShipPosition = this.updateShipPosition.bind(this);
    this.fireWeapon = this.fireWeapon.bind(this);
    this.passiveMovement = this.passiveMovement.bind(this);
    this.spawnAsteroid = this.spawnAsteroid.bind(this);
    this.checkForDestruction = this.checkForDestruction.bind(this);
    this.applyPhysics = this.applyPhysics.bind(this);
  }

  updateShipPosition(entities, { touches }) {
    if (this.state.gameStopped == true) { return }
    touches.filter(t => t.type === "move").forEach(t => {
      let ship = entities["ship"];
      if (ship && ship.body.position) {
        if (this.checkIfEntityisWithinBounds(ship, { x: t.delta.pageX, y: t.delta.pageY })) {
          ship.body.position.x = ship.body.position.x + t.delta.pageX;
          ship.body.position.y = ship.body.position.y + t.delta.pageY;
          Matter.Body.setVelocity(ship.body, { x: ship.body.position.x + t.delta.pageX, y: ship.body.position.y + t.delta.pageY });
          Matter.Body.setPosition(ship.body, { x: ship.body.position.x + t.delta.pageX, y: ship.body.position.y + t.delta.pageY });

        }

      }
    });

    return entities;
  };

  checkIfEntityisWithinBounds(entity, change) {

    let gameObject = entity;
    let x = gameObject.body.position.x + change.x;
    let y = gameObject.body.position.y + change.y;
    let outXBoundaries = (x >= WIDTH || x < 0);
    let outYBoundaries = (y >= HEIGHT || y < 0)
    if (outXBoundaries || outYBoundaries) {
      return false;
    } else {
      return true;
    }

  }

  //checks to see if there is a collision between two objects
  checkForCollision(elementA, elementB) {




  }

  fireWeapon(entities, { touches }) {
    if (this.state.gameStopped == true) { return }
    let world = entities["physics"].world;
    touches.filter(t => t.type === "press").forEach(t => {
      let ship = entities["ship"];
      let projectTile = Matter.Bodies.rectangle(ship.body.position.x, ship.body.position.y - 50, 10, 100);
      projectTile.label = "projectile"
      projectTile.friction = 0;
      projectTile.frictionAir = 0;
      Matter.Body.setMass(projectTile, 50);

      Matter.Body.setVelocity(projectTile, { x: 0, y: 6 });
      Matter.Body.applyForce(projectTile, { x: ship.body.position.x, y: ship.body.position.y }, { x: 0, y: -5 });

      // Matter.Body.setMass(projectTile,10);
      Matter.World.add(world, [projectTile]);
      let newId = "projectile" + projectTile.id;
      entities[newId] = { body: projectTile, velocity: { x: 0, y: -10 }, renderer: <ProjectTile /> }



    });

    return entities;
  };


  spawnAsteroid(entities, { touches, time }) {
    if (this.state.gameStopped == true) { return }
    let world = entities["physics"].world;
    let spawnX = Math.floor(Math.random() * (WIDTH - 10 - 10 + 1)) + 10;
    let flowRate = Math.random();
    let speed = Math.floor(Math.random() * (10 - 5 + 1)) + 3;
    if (flowRate < 0.02) {
      let length = Object.keys(entities).length;

      let aseteroidBody = Matter.Bodies.rectangle(spawnX, 0, 60, 60);//Matter.Bodies.circle(spawnX, 0, 50);
      aseteroidBody.friction = 0;
      aseteroidBody.frictionAir = 0;
      aseteroidBody.label = "asteroid";
      Matter.Body.applyForce(aseteroidBody, { x: spawnX, y: - 5 }, { x: 0, y: 2 });
      Matter.Body.setMass(aseteroidBody, 500);

      Matter.World.add(world, [aseteroidBody]);
      let ship = entities['ship'];
      let asteroid = {
        body: aseteroidBody,
        velocity: { x: 0, y: speed },
        renderer: <Asteroid height={60} width={60} />
      }

      entities[asteroid.body.label + asteroid.body.id] = asteroid;

    }

    return entities;





  }


  //remove entities that no longer have a body, and is out of bounds
  checkForDestruction(gameElements, { touches }) {
    if (this.state.gameStopped == true) { return }
    let world = gameElements["physics"].world;
    let remainingBodies = Matter.Composite.allBodies(engine.world);
    let existingBodies = remainingBodies.map((b) => {
      if (b.label == 'player') {
        return b.label
      }
      return b.label + b.id
    });
    if (!existingBodies.includes('player')) {
      delete gameElements['ship']
    };
    Object.keys(gameElements).forEach((key) => {



      let gameObj = gameElements[key];
      if (gameObj.velocity) {
        let delta = { x: 0, y: 0 }
        // If entity array key does not match with any existing body, delete it
        if (!existingBodies.includes(key)) {
          delete gameElements[key];
        } else {
          // if it exists then check if out of bounds
          if (!this.checkIfEntityisWithinBounds(gameElements[key], delta)) {
            let bodyToRemove = gameElements[key].body;
            Matter.Composite.remove(world, bodyToRemove);
            delete gameElements[key];
            // also remove the physics object from the worl
          }
        }
      }
    })

    return gameElements
  }


  applyPhysics(entities, { time }) {

    if (this.state.gameStopped == true) { return }

    let engine = entities["physics"].engine;

    Matter.Engine.update(engine, time.delta);

    return entities;
  }

  //moves asteroids, and other linear movment objects
  passiveMovement(entities, { touches }) {
    if (entities) {
      Object.keys(entities).forEach((id) => {


        let body = entities[id];

        if (body && body.velocity) {
          let newPos = { x: body.body.position.x + body.body.velocity.x, y: body.body.position.y + body.body.velocity.y };
          body.body.position.y = body.body.position.y + body.body.velocity.y;
          body.body.position.x = body.body.position.x + body.body.velocity.x;

        }


      })

      return entities;
    }
  }

  componentDidMount() {
    this.setState({score:0});

    let MatterEvents = Matter.Events.on(engine, 'collisionActive', (event) => {

      let collisionPairs = event.pairs;
      collisionPairs.forEach((pair, index) => {

        if (pair.bodyA.label == 'asteroid' && pair.bodyB.label == 'projectile') {
          Matter.Composite.remove(world, pair.bodyA);
          Matter.Composite.remove(world, pair.bodyB);
          this.setState({score:this.state.score + 100});

        }

        if (pair.bodyA.label == 'projectile' && pair.bodyB.label == 'asteroid') {
          Matter.Composite.remove(world, pair.bodyA);
          Matter.Composite.remove(world, pair.bodyB);
          this.setState({score:this.state.score + 100});

        }

        if (pair.bodyA.label == 'player' && pair.bodyB.label == 'asteroid') {
          Matter.Composite.remove(world, pair.bodyA);
          Matter.Composite.remove(world, pair.bodyB);
          this.setState({ gameStopped: true })
          this.refs.engine.stop();
          Alert.alert('Game over', 'game over thanks for playing');

        }

        if (pair.bodyA.label == 'asteroid' && pair.bodyB.label == 'player') {
          Matter.Composite.remove(world, pair.bodyA);
          Matter.Composite.remove(world, pair.bodyB);
          this.setState({ gameStopped: true })
          this.refs.engine.stop();
          Alert.alert('Game over', 'game over thanks for playing');

        }


      })


    });

  }

  componentWillUnmount() {
    Matter.Events.off()

  }


  render() {

    const { score } = this.state
    const shipBody = Matter.Bodies.rectangle(WIDTH / 2, HEIGHT / 2, 50, 50);
    shipBody.ignoreGravity = true;
    shipBody.label = 'player';
    Matter.World.add(world, [shipBody]);
    Matter.Body.setStatic(shipBody, true);
    console.log(this.state);



    return (

      <View style={styles.container}>

        <Text style={{ color: 'green' }}>{score}</Text>

        <GameEngine
          ref={"engine"}
          style={styles.container}
          systems={[

            this.spawnAsteroid,
            this.updateShipPosition,
            this.fireWeapon,
            this.applyPhysics,
            this.checkForDestruction,


          ]} //-- We can add as many systems as needed
          entities={{
            physics: {
              engine: engine,
              world: world,
            },
            ship: { body: shipBody, renderer: <SpaceShip /> },
            //-- Notice that each entity has a unique id (required)
          }}>

          <StatusBar hidden={true} />


        </GameEngine>




      </View>





    );
  }
}

const styles = StyleSheet.create({
  menus: {
    flex: 5,
    marginTop: 50,
    height: '20%',
    width: "100%",
    backgroundColor: "white"

  },
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  player: {
    position: "absolute",
    backgroundColor: "pink",
    width: RADIUS * 2,
    height: RADIUS * 2,
    borderRadius: RADIUS * 2
  }
});

