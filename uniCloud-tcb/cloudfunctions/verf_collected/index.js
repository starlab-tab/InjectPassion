'use strict';
const db = uniCloud.database()
exports.main = async (event) => {
	const {
		article_id,
		platform
	} = event
	let msg = "success"
	let res = await db.collection("collect_ids").where({platform: platform}).field({"collect_ids": true}).get()
	if (res.data[0].collect_ids.includes(article_id)) {
		res = null
		msg = "what ?"
	}else {
		res = {}
	}
	
	return {
		code: 200,
		msg: msg,
		data: res
	}
};
