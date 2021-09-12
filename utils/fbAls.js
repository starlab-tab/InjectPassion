export const fbAls = async (url) => {

	const res = await uni.request({
		url: url,
		method: "GET"
	})
	return res
}
