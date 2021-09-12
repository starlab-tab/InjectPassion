'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	
	const {
		platform
	} = event
	
	const res = await db.collection(platform).where({type: 'category'}).field({'name': true, 'link': true}).get()
	return {
		code: 200,
		msg: 'success',
		data: res.data
	}
};
