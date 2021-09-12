'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event) => {
	
	const {
		article_id,
		platform,
		collect
	} = event
	db.collection('collect').add(collect)
	await db.collection("collect_ids").where({platform: platform}).update({
		collect_ids: dbCmd.addToSet(article_id)
	})
	const res = await db.collection("collect_ids").where({platform: platform}).field({"collect_ids": true}).get()
	
	return {
		code: 200,
		msg: 'success',
		data: res.data
	}
};
