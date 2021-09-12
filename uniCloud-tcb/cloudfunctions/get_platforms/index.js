'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const res = await db.collection("normalway").field({'logo': true, 'title':true, 'platform':true}).get()
	console.log(res.data)
	return {
		code: 200,
		msg: 'success',
		data: res.data
	}
};
