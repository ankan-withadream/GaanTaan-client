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

    // const audioUrl = 'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3';
    const audioUrl = "http://localhost:3000/stream";
    const headers = {
       'Content-Type': 'audio/mpeg',
       'Access-Control-Allow-Origin': '*',
      };
    // this.http.get(audioUrl, { headers, responseType: 'blob' }).subscribe(response => {
    //   const audioBlob = new Blob([response], { type: 'audio/mpeg' });
    //   const audioUrl = URL.createObjectURL(audioBlob);
    //   console.log(audioUrl);
    //   // You can now use this audio URL to play the audio in an audio player component.
    // });

    this.http.get(audioUrl, { headers, responseType: 'blob' }).subscribe((audioBlob: Blob) => {
      const audioUrl = URL.createObjectURL(audioBlob);
      this.audioPlayer = new Audio(audioUrl);
      this.audioPlayer.addEventListener('loadedmetadata', () => {
        this.audioDuration = this.audioPlayer.duration;
      });
      this.audioPlayer.addEventListener('timeupdate', () => {
        this.currentTime = this.audioPlayer.currentTime;
      });
    });
  }



play() {
  console.log("play clicked", );
  if (this.audioPlayer) {
    this.audioPlayer.play();
    this.isPlaying = true;
  }
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
