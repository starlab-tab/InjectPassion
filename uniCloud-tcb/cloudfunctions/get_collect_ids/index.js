'use strict';
const db = uniCloud.database()
exports.main = async (event) => {

	const {
		platform
	} = event
	// const res = await db.collection('collect_ids').field({'_id': false}).get()
	let res = null
	if (platform === "all") {
		res = await db.collection('collect_ids').field({'_id': false}).get()
	}else {
		res = await db.collection('collect_ids').where({platform: platform}).field({'_id': false, 'platform': false}).get()
	}
	
	return {
		code: 200,
		msg: 'success',
		data: res.data
	}
};
