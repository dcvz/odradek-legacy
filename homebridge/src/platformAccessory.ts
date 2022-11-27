import * as io from 'socket.io-client';
import { Service, PlatformAccessory, CharacteristicGetCallback } from 'homebridge';

import { OdradekHomebridgePlatform } from './platform';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class OdradekPlatformAccessory {
  private service: Service;
  private socket: io.Socket;
  private isContactMade = false;

  constructor(
    private readonly platform: OdradekHomebridgePlatform,
    private readonly accessory: PlatformAccessory,
  ) {
    this.socket = io.connect('https://odradek.dcvz.io');

    this.socket.on('connect', () => {
      console.log('socket connection established');
      this.socket.emit('join', platform.config.stationId);
    });

    this.socket.on('disconnect', () => {
      console.log('socket connection lost');
    });

    this.socket.on('contact-event', (contactItemId: string) => {
      console.log('contact event for:', contactItemId);
      if (contactItemId.includes(accessory.context.device.uniqueId)) {
        console.log('match made, turning on!');
        this.isContactMade = true;
        this.service.updateCharacteristic(this.platform.Characteristic.ContactSensorState, true);

        setInterval(() => {
          this.isContactMade = false;
          this.service.updateCharacteristic(this.platform.Characteristic.ContactSensorState, false);    
        }, 1000);
      }
    });

    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Bella Cica')
      .setCharacteristic(this.platform.Characteristic.Model, accessory.context.device.uniqueId)
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'Default-Serial');

    // get the LightBulb service if it exists, otherwise create a new LightBulb service
    // you can create multiple services for each accessory
    this.service = this.accessory.getService(this.platform.Service.ContactSensor)
    || this.accessory.addService(this.platform.Service.ContactSensor);

    // set the service name, this is what is displayed as the default name on the Home app
    // in this example we are using the name we stored in the `accessory.context` in the `discoverDevices` method.
    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.displayName);

    // each service must implement at-minimum the "required characteristics" for the given service type
    // see https://developers.homebridge.io/#/service/Lightbulb

    // register handlers for the On/Off Characteristic
    this.service.getCharacteristic(this.platform.Characteristic.ContactSensorState)
      .on('get', this.getState.bind(this));               // GET - bind to the `getOn` method below
  }

  /**
   * Handle the "GET" requests from HomeKit
   * These are sent when HomeKit wants to know the current state of the accessory, for example, checking if a Light bulb is on.
   * 
   * GET requests should return as fast as possbile. A long delay here will result in
   * HomeKit being unresponsive and a bad user experience in general.
   * 
   * If your device takes time to respond you should update the status of your device
   * asynchronously instead using the `updateCharacteristic` method instead.

   * @example
   * this.service.updateCharacteristic(this.platform.Characteristic.On, true)
   */
  getState(callback: CharacteristicGetCallback) {
    this.platform.log.debug('Get Characteristic On ->', this.isContactMade);

    // you must call the callback function
    // the first argument should be null if there were no errors
    // the second argument should be the value to return
    callback(null, this.isContactMade);
  }
}
