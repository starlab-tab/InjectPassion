'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {

	const {
		name,
		platform
	} = event
	
	const res = await db.collection(platform).where({name: name}).field({'content': true}).get()
	console.log(res.data)
	return {
		code: 200,
		message: 'success',
		data: res.data
	}
};
