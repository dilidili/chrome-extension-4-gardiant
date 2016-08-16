const initialState = {
	isPagingMode: false,
}

export default (state = initialState, action) => {
	switch (action.type) {
		case "TURN_ON_PAGING_MODE":
			state.isPagingMode = true
			return state
		case "TURN_OFF_PAGING_MODE":
			state.isPagingMode = false
			return state
		default:
			return state
	}
}