'use strict';
const db = uniCloud.database()
exports.main = async (event) => {
	
	const {
		_id,
		type
	} = event
	
	let res = null
	
	if (type === "one") {
		res = await db.collection("traces").doc(_id).remove()
	}else if (type === "all") {
		res = await db.collection("traces").where({all: null}).remove()
	}
	
	return {
		code: 200,
		msg: 'success',
		data: res.data
	}
};
