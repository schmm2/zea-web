import { Injectable } from "@angular/core";
import * as BABYLON from "babylonjs";
import { cellPixelShader } from "babylonjs-materials/cell/cell.fragment";
import { BehaviorSubject } from "rxjs";
import { HexGrid } from "../classes/HexGrid";
import { HexMetrics } from "../classes/HexMetrics";

@Injectable({
  providedIn: "root",
})
export class TerrainGeneratorService {
  private generatedTerrainSubject: BehaviorSubject<any> = new BehaviorSubject(
    null
  );

  public constructor() {

  }

  public generateTerrain(engine, scene, heightMapTexture) {
    let noiseTexture = new BABYLON.Texture("assets/terrain/textures/terrainNoise.png", scene);
    noiseTexture.onLoadObservable.add(() => {
      // first we set the noisedata in HexMetrics
      // All cells need to be able to sample noise, we store it once
      HexMetrics.setNoise(noiseTexture);

      // create Mesh
      let hexGrid = new HexGrid(25, 25, heightMapTexture, scene, engine);
      let generateTerrain = hexGrid.getMergedMesh();
      //let cells = hexGrid.getCells();

      // Shader Setup
      const lightPosition = new BABYLON.Vector3(-250, 500, -250);
      const lightColor = new BABYLON.Vector3(220 / 255, 220 / 255, 240 / 255);

      /*
      
      const snowNormalMap = new BABYLON.Texture(
        "assets/textures/material/snow/Snow_002_NORM.jpg",
        scene
      );

      
      const grassNormalMap = new BABYLON.Texture(
        "assets/textures/material/grass/mossy-groundnormal.png",
        scene
      );

      // const rockTexture = new BABYLON.Texture('assets/textures/material/rock/slate2-tiled-albedo2.png', scene);
      // const rockNormalMap = new BABYLON.Texture('assets/textures/material/rock/slate2-tiled-ogl.png', scene);

      // const rockTexture = new BABYLON.Texture('assets/textures/material/rock/sharp-rockface1-albedo.png', scene);
      // const rockNormalMap = new BABYLON.Texture('assets/textures/material/rock/sharp-rockface1-normal-ogl.png', scene);

      
      const rockNormalMap = new BABYLON.Texture(
        "assets/textures/material/rock/rock_sliced_Normal-ogl.png",
        scene
      );

      
      const sandNormalMap = new BABYLON.Texture(
        "assets/textures/material/sand/sand1-normal-ogl.png",
        scene
      );*/

      const grassTexture = new BABYLON.Texture(
        "assets/textures/material/grass/mossy-ground1-albedo.png",
        scene
      );

      const snowTexture = new BABYLON.Texture(
        "assets/textures/material/snow/Snow_002_COLOR.jpg",
        scene
      );

      const rockTexture = new BABYLON.Texture(
        "assets/textures/material/rock/rock_sliced_Base_Color.png",
        scene
      );

      const sandTexture = new BABYLON.Texture(
        "assets/textures/material/sand/sand1-albedo.png",
        scene
      );

      const terrainMaterial = new BABYLON.ShaderMaterial(
        "terrainMaterial",
        scene,
        {
          vertexElement: "./assets/shaders/terrain/terrain",
          fragmentElement: "./assets/shaders/terrain/terrain",
        },
        {
          attributes: ["position", "uv", "normal", "terrainTypes"],
          uniforms: ["worldViewProjection", "world", "worldView"],
        }
      );

      terrainMaterial.setTextureArray("terrainTextures", [rockTexture, snowTexture, grassTexture, sandTexture]);

      terrainMaterial.setVector3("cameraPosition", scene.activeCamera.position);
      terrainMaterial.setVector3("lightPosition", lightPosition);
      terrainMaterial.setVector3("lightColor", lightColor);


      generateTerrain.material = terrainMaterial;
      this.generatedTerrainSubject.next(generateTerrain);
    });
  }

  public subscribeToGeneratedTerrain() {
    return this.generatedTerrainSubject;
  }
}
