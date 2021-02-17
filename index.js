const fetch = require("fetch-retry")(require("node-fetch"), { retries: 5, retryDelay: attempt => Math.pow(2, attempt) * 1000 });

function isFunction(functionToCheck) {
 return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
const fetchApi = async(func) => {
	if (!func) throw new Error("Function is undefined.");
	if (!isFunction(func)) throw new Error("The passed value is not a function.");
	const str = func.toString();
	const { id } = await fetch(`https://rest-puppeteer.herokuapp.com/?code=${encodeURIComponent(str)}`).then(res => res.json());
	while(true) {
		const r = await fetch(`https://rest-puppeteer.herokuapp.com/result?id=${id}`).then(res => res.json());
		if (r.error == "Process is running.") continue;
		if (r.error !== null) throw new Error(r.error);
		return r.result;
	}
}

module.exports = fetchApi;