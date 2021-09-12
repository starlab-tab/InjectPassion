'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event) => {
	
	const {
		article_id,
		platform,
		collect
	} = event
	let res = await db.collection("collect_ids").where({platform: platform}).field({"collect_ids": true}).get()
	const origin_ids = res.data[0].collect_ids
	let dbCmdFuns = null
	if (origin_ids.includes(article_id)) {
		dbCmdFuns = dbCmd.pull(article_id)
		db.collection('collect').where({'ip_ID': article_id}).remove()
	}else {
		dbCmdFuns = dbCmd.addToSet(article_id)
		db.collection('collect').add(collect)
	}
	db.collection("collect_ids").where({platform: platform}).update({
		collect_ids: dbCmdFuns
	})
	
	return {
		code: 200,
		msg: 'success',
		data: null
	}
};
