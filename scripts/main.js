/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

/* eslint-env browser, es6 */

'use strict';

const applicationServerPublicKey = 'BCW6JPG-T7Jx0bYKMhAbL6j3DL3VTTib7dwvBjQ' +
  'C_496a12auzzKFnjgFjCsys_YtWkeMLhogfSlyM0CaIktx7o';

//const pushButton = document.querySelector('.js-push-btn');
const pushButton = document.getElementById("sendpush");

//let isSubscribed = false;
var swRegistration = null;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/*function updateBtn() {
  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
}*/

/*function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server

  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionDetails =
    document.querySelector('.js-subscription-details');

  if (subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    subscriptionDetails.classList.remove('is-invisible');
  } else {
    subscriptionDetails.classList.add('is-invisible');
  }
}*/


function updateSubscriptionOnServer(subscription) {
    // TODO: Send subscription to application server

/*    const subscriptionJson = document.querySelector('.js-subscription-json');
    const subscriptionDetails =
        document.querySelector('.js-subscription-details');

    if (subscription) {
        subscriptionJson.textContent = JSON.stringify(subscription);
        subscriptionDetails.classList.remove('is-invisible');
    } else {
        subscriptionDetails.classList.add('is-invisible');
    }*/
    document.getElementById("pushmsg").innerHTML = JSON.stringify(subscription) + '<br>';
}

function subscribeUser() {
  pushButton.disabled = true;
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
  })
  .then(function(subscription) {
    console.log('User is subscribed');
    console.log('User is subscribed subscription=' + JSON.stringify(subscription));

    updateSubscriptionOnServer(subscription);

    //isSubscribed = true;

    //updateBtn();
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
      if (Notification.permission === 'denied') {
          // The user denied the notification permission which
          // means we failed to subscribe and the user will need
          // to manually change the notification permission to
          // subscribe to push messages
          console.warn('Permission for Notifications was denied');
          pushButton.disabled = true;
      } else {
          // A problem occurred with the subscription; common reasons
          // include network errors, and lacking gcm_sender_id and/or
          // gcm_user_visible_only in the manifest.
          console.error('Unable to subscribe to push.', err);
          pushButton.disabled = false;
          pushButton.textContent = 'Enable Push Messages';
      }
    //updateBtn();
  });
}


function subscribe() {
    // Disable the button so it can't be changed while
    // we process the permission request
    //var pushButton = document.querySelector('.js-push-button');
    pushButton.disabled = true;

    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        serviceWorkerRegistration.pushManager.subscribe({
            userVisibleOnly: true,
        }
        )
            .then(function(subscription) {
                // The subscription was successful
                //isPushEnabled = true;
                pushButton.textContent = 'Disable Push Messages';
                pushButton.disabled = false;

                // TODO: Send the subscription.endpoint to your server
                // and save it to send a push message at a later date
                return sendSubscriptionToServer(subscription);
            })
            .catch(function(e) {
                if (Notification.permission === 'denied') {
                    // The user denied the notification permission which
                    // means we failed to subscribe and the user will need
                    // to manually change the notification permission to
                    // subscribe to push messages
                    console.warn('Permission for Notifications was denied');
                    pushButton.disabled = true;
                } else {
                    // A problem occurred with the subscription; common reasons
                    // include network errors, and lacking gcm_sender_id and/or
                    // gcm_user_visible_only in the manifest.
                    console.error('Unable to subscribe to push.', e);
                    pushButton.disabled = false;
                    pushButton.textContent = 'Enable Push Messages';
                }
            });
    });
}

function initializeUI() {
  pushButton.addEventListener('click', function() {
    //pushButton.disabled = true;
/*    if (isSubscribed) {
      // TODO: Unsubscribe user
    } else {
      subscribeUser();
    }*/
    subscribeUser();
    //subscribe();
  });

  // Set the initial subscription value
/*  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    //updateSubscriptionOnServer(subscription);

    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn();
  });*/
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('sw.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;
    initializeUI();
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });

} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}
