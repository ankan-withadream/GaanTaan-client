import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  // audioPlayer: HTMLAudioElement;
  audioPlayer: any;
  isPlaying: boolean = false;
  audioDuration: number = 0;
  currentTime: number = 0;

  // fileToUpload: File = null;
  fileToUpload: any;
  fileFormGroup : any;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    ) {

    }

  ngOnInit(): void {
    this.fileFormGroup = this.formBuilder.group({
      fileForm: ["", Validators.required]
    })
  }

  async load_song() {
    const audioUrl = 'http://localhost:3000/stream';
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
      });
    });
  }

  async play() {
    console.log('play clicked');
    if (this.audioPlayer == undefined) {
      // load song metadata
      await this.load_song()
        .then((audioPlayer) => {
          console.log('audioPlayer', audioPlayer);
        })
        .catch((error) => {
          console.log('error', error);
        });
    }
    this.audioPlayer.play();
    this.isPlaying = true;
  }

  pause() {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.isPlaying = false;
    }
  }

  seek(timeEvent: any) {
    let time: number = timeEvent.target.value;
    console.log('time got', time);
    console.log('audioplayer', this.audioPlayer);
    if (this.audioPlayer) {
      this.audioPlayer.currentTime = time;
    }
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }


  handleFileInput(files: any) {
    let file = files.target.files;
    this.fileToUpload = file[0];
    console.log("File selected: ", this.fileToUpload);
  }

  uploadFileToServer() {
    console.log("File selected to upload: ", this.fileToUpload);

    const httpOptions = {
      headers: new HttpHeaders({
          "Content-Type": "*",
      })
  };
    const endpoint = 'http://localhost:3000/upload-audio';
    let formData: any = new FormData();
    // formData.append('audioUrl', this.fileToUpload );
    // formData.append('filename', this.fileToUpload.name );
    formData.append('audioFile', this.fileToUpload, this.fileToUpload.name);
    for (var pair of formData.entries()) {
      console.log(pair[0]+ ', ' + pair[1]); 
  }
    console.log("bofore request, formdata:", formData.values());
    // let data = {
    //   filename: this.fileToUpload.name,
    //   audioFile: this.fileToUpload
    // }

    // const req = new HttpRequest('OPTIONS', endpoint, httpOptions)
  // console.log("fileForm: ", this.fileFormGroup.value);
  //   let data = {
  //     "filename": this.fileToUpload.name,
  //     "audioFile": this.fileFormGroup.value
  //   }

    this.http.post(endpoint, formData).subscribe(
      (response) => console.log(response),
      (error) => console.log(error)
    );
  }
}
