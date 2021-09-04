const {Atem} = require('atem-connection')
const ioHook = require('iohook')

const keyRef = {
	"49":  1,
	"50":  2,
	"51":  3,
	"52":  4,
	"53":  5,
	"54":  6,
	"55":  7,
	"56":  8,
	"57":  9,
	"48":  10
}	

const myAtem1 = new Atem()
const myAtem2 = new Atem()

myAtem1.on('info', console.log)
myAtem2.on('info', console.log)

myAtem1.connect('192.168.100.240')
myAtem2.connect('169.254.152.19')

myAtem1.on('connected', () => {
	console.log("atem1")
	keypress(0, myAtem1)
})

myAtem2.on('connected', () => {
	console.log("atem2")
	keypress(1, myAtem2)
})

const keypress = (AtemNumber: number, AtemClass: { changeProgramInput: (arg0: any) => Promise<any> }) => {
	ioHook.on('keydown', (event: { rawcode: number }) => {
		const { rawcode } = event
		if(rawcode >= 48 && rawcode <= 57) {
			const keyboardNumber = keyRef[rawcode] 
			const firstRange = [1,6]
			const secondRange = [5,10]
			if(keyboardNumber >= firstRange[AtemNumber]  && keyboardNumber <= secondRange[AtemNumber]) {
				const sourceNumber = AtemNumber === 0 ? keyboardNumber + 3 : keyboardNumber - 2
				AtemClass.changeProgramInput(sourceNumber).then(() => {
					console.log(`changed atem ${AtemNumber} source`)
				})
			}
		} 	
	})
	ioHook.start()
}