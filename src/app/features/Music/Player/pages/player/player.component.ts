import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  // audioPlayer: HTMLAudioElement;
  audioPlayer: any;
  isPlaying = false;
  audioDuration: number = 0;
  currentTime = 0;

  constructor(
    private http: HttpClient,
  ) {

  }

  ngOnInit(): void {

  }

  async load_song() {
    const audioUrl = "http://localhost:3000/stream";
    const headers = {
      'Content-Type': 'audio/mpeg',
      'Access-Control-Allow-Origin': '*',
    };

    return new Promise(async (resolve, reject) => {
      const that = this;
      this.http.get(audioUrl, { headers, responseType: 'blob' }).subscribe({
        next(audioBlob: Blob) {
          const audioUrl = URL.createObjectURL(audioBlob);
          that.audioPlayer = new Audio(audioUrl);
          resolve(that.audioPlayer);
          that.audioPlayer.addEventListener('loadedmetadata', () => {
            that.audioDuration = that.audioPlayer.duration;
          });
          that.audioPlayer.addEventListener('timeupdate', () => {
            that.currentTime = that.audioPlayer.currentTime;
          });
        },

        error(error) {
          reject(error);
        },
      }

      );
    })

  }



  async play() {
    console.log("play clicked",);
    await this.load_song().then((audioPlayer) => {
      console.log("audioPlayer", audioPlayer);
      this.audioPlayer.play();
      this.isPlaying = true;
    }).catch((error) => {
      console.log("error", error);
    })
    // if (this.audioPlayer) {
    //   this.audioPlayer.play();
    //   this.isPlaying = true;
    // }
  }

  pause() {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.isPlaying = false;
    }
  }

  seek(timeEvent: any) {
    let time: number = timeEvent.target.value
    console.log("time got", time);
    console.log("audioplayer", this.audioPlayer);
    if (this.audioPlayer) {
      this.audioPlayer.currentTime = time;
    }
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

}
