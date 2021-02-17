# No-Install-Puppeteer
Ever want to use [puppeteer](https://www.npmjs.com/package/puppeteer "puppeteer") in your project, but found it too big?
If so, I have got the perfect solution for you!

This package calls puppeteer from an external API (https://rest-puppeteer.herokuapp.com). Puppeteer runs there, and not in your package.

## Usage
    const nip = require("no-install-puppeteer");
    
    console.log(await nip(page => {
    	/*
    		Do stuff with the page
    		There is no need to do page.close() since the API does it for you
    		Also, do not do browser.close()
    	*/
    }));
	
If there is an error in the process, the package will throw the error.
Else the package will return what you want it to return (if you actually made your function correctly. I'm not responsible for logic errors.)