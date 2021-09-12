'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	
	const {
		trace
	} = event

	const res = await db.collection("traces").where({ip_ID: trace.ip_ID}).field({"_id": true}).get()
	let msg = "success"

	if (res.data.length === 0) {
		db.collection('traces').add(trace)
	}else {
		msg = "reject"
	}
	return {
		code: 200,
		msg: msg,
		data: null
	}
};