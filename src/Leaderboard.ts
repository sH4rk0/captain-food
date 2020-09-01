import * as firebase from "firebase";

export default class Leaderboard {
  private firebaseConfig = {
    apiKey: "AIzaSyCl5ydtUBpqN4Zvf-XAd014xQmKlIvpwnE",
    authDomain: "captain-food.firebaseapp.com",
    databaseURL: "https://captain-food.firebaseio.com",
    projectId: "captain-food",
    storageBucket: "captain-food.appspot.com",
    messagingSenderId: "692843702258",
    appId: "1:692843702258:web:27a2f956d18c6be063ad6b",
    measurementId: "G-S0K0VJ5XMX"
  };
  private fireBaseApp: firebase.app.App;
  private fireBaseDb: firebase.database.Database;
  private scores: firebase.database.Reference;
  private highscores: Array<any>;
  private allscores: Array<any>;

  constructor() {
    this.fireBaseApp = firebase.initializeApp(this.firebaseConfig);
    this.fireBaseDb = this.fireBaseApp.database();
    this.scores = this.fireBaseDb.ref("scores");
    this.highscores = [];
    this.allscores = [];
    this.getData();
  }

  insertScore(score: ScoreConfig) {
    
    if(score.score!=0 && score.name!="")
    this.scores.push(score);
  }

  getHighscores() {
    return this.highscores;
  }

  getData() {
    this.scores.on("value", (data) => {
      //console.log(data.val());
      this.allscores = [];
      Object.entries(data.val()).forEach((entry) => {
        let key = entry[0];
        let value = entry[1];
        this.allscores.push(value);
      });

      this.allscores.sort((a: any, b: any) => {
        const valueA = a.score;
        const valueB = b.score;

        let comparison = 0;
        if (valueA < valueB) {
          comparison = 1;
        } else if (valueA > valueB) {
          comparison = -1;
        }
        return comparison;
      });

      if (this.allscores.length > 0) {
        this.highscores = [];
        for (let i = 0; i < 5; i++) {
          this.highscores.push(this.allscores[i]);
        }
      }

      // console.log(this.highscores);
    });
  }
}
