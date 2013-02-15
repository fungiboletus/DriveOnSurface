/**
 * Game settings.
 *
 * This file is released under the CeCILL-B V1 licence.
 */

module.exports = {

	// The server port
	port: 3333,

	// The verbose mode  (the windows console could make
	// some lag with this settings activated)
	verboseLog: false,
	compressREST: false,

	canvasSize: [960, 540],
	sendingDelay: 1000,

	tagCodes: {
		0x00: ["rabbit", "Yellow"],
		0x01: ["nails", "Yellow"],
		0x02: ["biggerengine", "Yellow"],
		0x03: ["train", "Yellow"],

		0x21: ["rabbit", "Red"],
		0x20: ["nails", "Red"],
		0x22: ["biggerengine", "Red"],
		0x23: ["train", "Red"],

		0x11: ["rabbit", "Blue"],
		0x13: ["nails", "Blue"],
		0x12: ["biggerengine", "Blue"],
		0x10: ["train", "Blue"],

		0x31: ["rabbit", "Green"],
		0x32: ["nails", "Green"],
		0x33: ["biggerengine", "Green"],
		0x30: ["train", "Green"]
	}
};