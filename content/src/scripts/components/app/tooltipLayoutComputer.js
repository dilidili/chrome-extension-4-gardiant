const TOOLTIP_WIDTH = 395
const TOOLTIP_HEIGHT = 200
const TOOLTIP_MARGIN = 12
const TOOLTIP_TRI_LENGTH = 10

export default {
	/**
	 * @param {Object} wordBoundingClientRect
	 * @return A new boundingClientRect of tooltip indicates resonable postion and width on the current page.
	 */
	tooltipLayoutComputer: (wordBoundingClientRect) => {
		const {
			innerWidth: iw,
			innerHeight: ih,
		} = window
		const {
			width: ww,
			height: wh,
			left: wl,
			top: wt,
		} = wordBoundingClientRect
		const [wordCenterLeft, wordCenterTop] = [wl + ww / 2, wt + wh / 2]

		const width = Math.min(iw * 0.8, TOOLTIP_WIDTH)
		const height = TOOLTIP_HEIGHT
			// left is restrained by both sides
		const left = Math.min(Math.max(TOOLTIP_MARGIN, wordCenterLeft - width / 2), iw - TOOLTIP_MARGIN - width)
		const top = wordCenterTop + TOOLTIP_MARGIN * 1.8

		return {
			content: {
				width,
				height,
				left,
				top,
				opacity: 0,
			},
			tri: {
				borderWidth: TOOLTIP_TRI_LENGTH,
				top: -TOOLTIP_TRI_LENGTH+2,
				left: wordCenterLeft - left - TOOLTIP_TRI_LENGTH,
			},
			key: Math.random().toString(32).slice(2),
		}
	},
	/**
	 * @param  {Object} config configuration object from react-motion.
	 * @return {Object} layout object about tooltip when it is animating.       
	 */
	getTooltipStyle: (config) => {
		const {
			data: {
				content,
				tri,
			},
			style: {
				opacity,
				scale
			}
		} = config
		const rightPartLength = content.width - tri.left - tri.borderWidth / 2
		const leftPartLength = content.width - rightPartLength

		return {
			content: {
				height: content.height * scale,
				width: content.width * scale,
				left: content.left + leftPartLength * (1 - scale),
				top: content.top,
				opacity: opacity,
			},
			tri: {
				left: leftPartLength * scale - tri.borderWidth * scale / 2,
				top: tri.top,
				opacity: opacity,
				borderWidth: tri.borderWidth,
			}
		}
	}
}