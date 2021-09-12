'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {

	const {
		_id,
		platform,
		tabContent
	} = event

	db.collection(platform).doc(_id).update({content: tabContent})
	return {
		code: 200,
		msg: 'success',
		data: null
	}
};
