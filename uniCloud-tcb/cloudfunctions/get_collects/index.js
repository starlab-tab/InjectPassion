'use strict';
const db = uniCloud.database()
exports.main = async (event) => {
	
	const {
		page,
		limit
	} = event


	const res = await db.collection('collect')
	.orderBy("collect_date", "desc")
	.skip((page - 1) * limit)
	.limit(limit)
	.get()
	return {
		code: 200,
		message: 'success',
		data: res.data
	}
};
