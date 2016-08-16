const TOOLTIP_WIDTH = 395
const TOOLTIP_HEIGHT = 405
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

		const width = TOOLTIP_WIDTH
		const height = TOOLTIP_HEIGHT
		// left is restrained by both sides
		const left = Math.min(Math.max(TOOLTIP_MARGIN, wordCenterLeft - width / 2), iw - TOOLTIP_MARGIN - width)
		// top is restrained by top and bottom sides.
		let top = 0
		const tooltipDireactionUp = wordCenterTop + TOOLTIP_MARGIN * 1.8 + TOOLTIP_HEIGHT > window.innerHeight
		if (tooltipDireactionUp) {
			top = wordCenterTop - TOOLTIP_MARGIN * 1.8 - TOOLTIP_HEIGHT
		} else {
			top = wordCenterTop + TOOLTIP_MARGIN * 1.8
		}

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
				top: !tooltipDireactionUp ? -TOOLTIP_TRI_LENGTH + 2 : TOOLTIP_HEIGHT - 2,
				left: wordCenterLeft - left - TOOLTIP_TRI_LENGTH,
				tooltipDireactionUp,
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
				top: !tri.tooltipDireactionUp ? content.top : content.top + content.height * (1 - scale),
				opacity: opacity,
			},
			tri: {
				left: leftPartLength * scale - tri.borderWidth * scale / 2,
				top: !tri.tooltipDireactionUp ? tri.top : tri.top + tri.borderWidth * (1 - scale),
				opacity: opacity,
				borderWidth: tri.borderWidth,
			}
		}
	}
}