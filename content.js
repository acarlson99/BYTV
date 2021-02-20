// 'use strict'

const axios = require('axios');
const $ = require('jquery')
const Buffer = require('buffer').Buffer

console.log("Hello from BYTV console")

// TODO: only do things for YT links
// TODO: intercept live chat messages

const getRequest = async () => {
	try {
		const response = await axios.get('https://api.betterttv.net/3/cached/frankerfacez/users/twitch/71092938');
		console.log(response.data[0].images['4x']);

		const resp = await axios.get(response.data[0].images['4x'])
		const d = resp.data
		console.log(d)

		const b64 = Buffer.from(d).toString("base64")

		$('#logo-icon').html('<img id="logo-icon" class="style-scope ytd-topbar-logo-renderer" src=' + response.data[0].images['4x'] + " />")
	} catch (err) {
		console.error(err);
	}
};

getRequest()

alert("Hello from BYTV")
