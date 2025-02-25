import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { ProfileData } from '../../providers/PDP-profileData';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Camera } from '@ionic-native/camera/ngx';
import { FormGroup, FormControl } from '@angular/forms';
import { ProfilePage } from '../PDP-profile/PDP-profile';

@Component({
  selector: 'page-PDP-edit-profile',
  templateUrl: 'PDP-edit-profile.html'
})
export class EditProfilePage {
  profile: any;
  loading: any;
  editProfile: FormGroup;
  formInput = {fName: '', desc: '', add: '', phone: '', email: '',
  //img: ''
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public camera: Camera, public profileData: ProfileData) {
    this.profile = navParams.get('data');
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Saving'
    });

    this.editProfile = new FormGroup({
      fName: new FormControl(),
      desc: new FormControl(),
      add: new FormControl(),
      phone: new FormControl(),
      email: new FormControl(),
      //img: new FormControl() 
    });
  }
  
  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Confirm save',
      message: 'Would you like to save your changes?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('No');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.updateProfile();
            this.loading.present();
            console.log('Yes');
          }
        }
      ]
    });
    alert.present();
  }

  presentCancel() {
    let alert = this.alertCtrl.create({
      title: 'Confirm cancel',
      message: 'Would you like to discard your changes and go back?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('No');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.navCtrl.pop();
            console.log('Yes');
          }
        }
      ]
    });
    alert.present();
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Confirmation',
      subTitle: 'Your profile has been updated',
      buttons: [{
        text: 'Return',
        handler: () => {
          this.navCtrl.setRoot(ProfilePage);
        }
      }]
    });
    alert.present();
  }

  updateProfile(){
    var url = 'https://foodie1234.herokuapp.com/updateProfile';
    var postData = JSON.stringify({
      // post data MUSt match the request.body.userID; 
      profileID: this.profile.id,
      profileName: this.editProfile.value['fName'],
      profileLocation: this.editProfile.value['add'],
      profileDesc: this.editProfile.value['desc'],
      profilePhone: this.editProfile.value['phone'],
      profileEmail: this.editProfile.value['email'],
      profileImg: this.profile.image // this.editProfile.value['img']
    });

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE'
      })
    };   

    this.http.post(url, postData, httpOptions).subscribe((data) => {
      console.log("In /updateProfile");
      console.log('postData:', postData);
      console.log('SQL Result: ', data);
      this.profileData.getProfileData();
      setTimeout(() => {
        this.loading.dismiss();
        this.presentAlert();
      }, 500);
    });
  }
}
