const puppeteer = require('puppeteer');
const {installMouseHelper} = require('./install-mouse-helper');

function wait(ms) {
    var start = Date.now(),
        now = start;
    while (now - start < ms) {
      now = Date.now();
    }
}

async function mineHere(targetPage, previousX, previousY) {
	targetX = xCoor();
	targetY = yCoor();
	console.log('Targetting: ', targetX, targetY)

	if (previousX !== null && previousY !== null) {
		while (Math.abs(targetX-previousX) < 20 || Math.abs(targetY-previousY) < 20) {
			console.log('Target less than 20, targetting: ', targetX, targetY)
			targetX = xCoor();
			targetY = yCoor();
		} 
	}

	console.log('Moving to: ', targetX, targetY)
	await targetPage.mouse.click(targetX, targetY);

	wait(3000);

	console.log('Mining at: ', targetX, targetY)
	await targetPage.mouse.click(200, 550);
	await targetPage.mouse.click(200, 350);

	wait(10000);
	return {
		x: targetX,
		y: targetY
	}
}

function xCoor() {
	return Math.random() * (500 - 200) + 200;
}

function yCoor() {
	return Math.random() * (550 - 350) + 350;
}

(async () => {
	try {
	const browserWSEndpoint = 'ws://127.0.0.1:9222/devtools/browser/18439748-bafe-4a71-bb79-629ffd804ca3';

	const browser = await puppeteer.connect({browserWSEndpoint, ignoreHTTPSErrors: true});
	const pages = await browser.pages()
	const targetPage = pages[0]
	await installMouseHelper(targetPage);

  console.log('Starting')
  wait(500)
  previousX = null
  previousY = null
  while (true) {
	lastCoor = await mineHere(targetPage, previousX, previousY);
	previousX = lastCoor.x;
	previousY = lastCoor.y;
  }
} catch (e) {
	console.error(e)
}
})();