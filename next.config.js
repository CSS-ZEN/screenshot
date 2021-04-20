module.exports = {
	images: {
		domains: [process.env['NEXT_AWSHOST'], '127.0.0.1']
	},
	env: {
		NEXT_AWSHOST: process.env['NEXT_AWSHOST']
	},
}