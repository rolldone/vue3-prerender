const axios = require('axios');

export default async (url, options, code) => {
	if (typeof url !== 'string') {
		throw new TypeError('Expected a string');
	};

	const response = await axios({
		method: 'GET',
		url,
		...options
	});
	
	let string = response.data.toString();
	if (code) {
		string += '\n' + code;
	}

	return eval(string);
};
