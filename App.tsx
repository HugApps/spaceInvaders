import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import SpaceShip from './Entities/SpaceShip';
import ProjectTile from './Entities/Projectile';
import Asteroid from './Entities/Asteriod';
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import Asteriod from './Entities/Asteriod';
//360x640
Matter.Common.isElement = () => false;
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

const RADIUS = 25;



export default class App extends React.Component {
  constructor(props) {
    super(props);
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
    touches.filter(t => t.type === "move").forEach(t => {
      let ship = entities["ship"];
      if (ship && ship.body.position) {
        if (this.checkIfEntityisWithinBounds(ship, { x: t.delta.pageX, y: t.delta.pageY })) {
          ship.body.position.x = ship.body.position.x + t.delta.pageX;
          ship.body.position.y = ship.body.position.y + t.delta.pageY;
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
    let world = entities["physics"].world;
    touches.filter(t => t.type === "press").forEach(t => {
      let ship = entities["ship"];
      let projectTile = Matter.Bodies.rectangle(ship.body.position.x, ship.body.position.y - 50, 10, 100);
      Matter.Body.setMass(projectTile,50);
      Matter.Body.setVelocity(projectTile,{x:0,y:6});
      Matter.Body.applyForce(projectTile,{x:ship.body.position.x,y:ship.body.position.y},{x:0,y:-5});
 
     // Matter.Body.setMass(projectTile,10);
      Matter.World.add(world, [projectTile]);
      let newId = "projectile" + projectTile.id;
      entities[newId] = { body: projectTile, velocity: { x: 0, y: -10 },  renderer: <ProjectTile /> }



    });

    return entities;
  };


  spawnAsteroid(entities, { touches, time }) {
    let world = entities["physics"].world;
    let spawnX = Math.floor(Math.random() * (WIDTH - 0 + 1)) + 0;
    let flowRate = Math.random();
    let speed = Math.floor(Math.random() * (10 - 5 + 1)) + 3;
    if (flowRate < 0.05) {
      let length = Object.keys(entities).length;
      let aseteroidBody = Matter.Bodies.circle(spawnX, 0, 50);
      Matter.Body.applyForce(aseteroidBody,{x:spawnX,y:-10},{x:0,y:3});
      Matter.Body.setMass(aseteroidBody,500);
      Matter.World.add(world, [aseteroidBody]);
      let ship = entities['ship'];
      let asteroid = {
        body: aseteroidBody,
        velocity: { x: 0, y: speed },
        renderer: <Asteroid />
      }

      entities['asteroid' + asteroid.body.id] = asteroid;

    }

    return entities;





  }


  checkForDestruction(gameElements, { touches }) {
    //destroy objects that are out of bounds
    Object.keys(gameElements).forEach((key) => {
      let gameObj = gameElements[key];
      if (gameObj.velocity) {
        let delta = { x: 0, y: 0 }
        if (!this.checkIfEntityisWithinBounds(gameElements[key], delta)) {
          delete gameElements[key];
        }
      }
    })
    return gameElements
  }


  applyPhysics(entities, { time }) {



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

  render() {

    const engine = Matter.Engine.create({ enableSleeping: false });
    engine.world.gravity.y = 0;
    const world = engine.world;
    const shipBody = Matter.Bodies.rectangle(WIDTH / 2, HEIGHT / 2, 50, 50);
    shipBody.ignoreGravity = true;
    Matter.World.add(world, [shipBody]);
  
    

    return (
      <GameEngine
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
          ship: { body: shipBody,  renderer: <SpaceShip /> },
          //-- Notice that each entity has a unique id (required)
        }}>

      </GameEngine>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "beige"
  },
  player: {
    position: "absolute",
    backgroundColor: "pink",
    width: RADIUS * 2,
    height: RADIUS * 2,
    borderRadius: RADIUS * 2
  }
});

