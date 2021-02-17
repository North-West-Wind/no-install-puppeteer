const fetch = require("fetch-retry")(require("node-fetch"), { retries: 5, retryDelay: attempt => Math.pow(2, attempt) * 1000 });
function getFunctionBody(f) {
	const firstLn = f.toString().split("\n")[0];
	const fmatches = firstLn.match(/^(async +)?function\(\w+\) +\{/);
	if (fmatches) {
		const str = f.toString().split("\n").slice(1).join("\n");
		if (str.lastIndexOf("}") === -1) return null;
		return str.slice(0, str.lastIndexOf("}"));
	}
	const matches = f.toString().match(/^(?:\s*\(?(?:\s*\w*\s*,?\s*)*\)?\s*?=>\s*){?([\s\S]*)}?$/);
	if (!matches) {
	  return null;
	}
	const firstPass = matches[1];
	const secondPass =
	  (firstPass.match(/{/g) || []).length === (firstPass.match(/}/g) || []).length - 1 ?
		firstPass.slice(0, firstPass.lastIndexOf('}')) :
		firstPass
	
	return secondPass;
  }

function isFunction(functionToCheck) {
	return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]' || {}.toString.call(functionToCheck) === '[object AsyncFunction]';
}
const fetchApi = async (func) => {
	if (!func) throw new Error("Function is undefined.");
	if (!isFunction(func)) throw new Error("The passed value is not a function.");
	const str = getFunctionBody(func);
	if (str === null) throw new Error("Invalid function.");
	const { id } = await fetch(`https://rest-puppeteer.herokuapp.com/?code=${encodeURIComponent(str)}`).then(res => res.json());
	while (true) {
		const r = await fetch(`https://rest-puppeteer.herokuapp.com/result?id=${id}`).then(res => res.json());
		if (r.error == "Process is running.") continue;
		if (r.error !== null) throw new Error(r.error);
		return r.result;
	}
}

module.exports = fetchApi;