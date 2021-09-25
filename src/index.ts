const { Atem } = require('atem-connection')
const ioHook = require('iohook')
const nfetch = require('node-fetch')

const numbersKeyRef:any = {
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

const numpadKeyRef:any = {
	"96":  10,
	"97":  1,
	"98":  2,
	"99":  3,
	"100": 4,
	"101":  5,
	"102":  6,
	"103":  7,
	"104":  8,
	"105":  9
}

const fetchAndStart = async (index: number, myAtem: { changeProgramInput: (arg0: any) => Promise<any> }) => {
  ioHook.stop()
  const refRes = await nfetch('http://localhost:3000/api/data')
  const refData = await refRes.json() 
  keypress(index, myAtem, refData)
}

const startAtem = (ip:string, index:number) => {
	const myAtem = new Atem()
	myAtem.on('info', console.log)
	myAtem.connect(ip)
	myAtem.on('connected', () =>{
		console.log(`atem ID: ${ip} connected`)
		setInterval(fetchAndStart, 5000)
	})
}

const keypress = (AtemNumber: number, AtemClass: { changeProgramInput: (arg0: any) => Promise<any> }, refData: { [x: string]: { [x: string]: any }[] }) => {
	const firstRange = [1,6]
	const secondRange = [5,10]
	ioHook.on('keydown', (event: { rawcode: number }) => {
		const { rawcode } = event
		let keyboardNumber = 0
		if(rawcode >= 48 && rawcode <= 57) {keyboardNumber = numbersKeyRef[rawcode]} 	
		if(rawcode >= 96 && rawcode <= 105) {keyboardNumber = numpadKeyRef[rawcode]}
    const manualConversionN = refData["data"][keyboardNumber-1]["id"]
		if(manualConversionN >= firstRange[AtemNumber] && manualConversionN <= secondRange[AtemNumber]) {
			const sourceNumber = AtemNumber === 0 ? manualConversionN + 3 : manualConversionN - 2
			AtemClass.changeProgramInput(sourceNumber).then(() => {
				console.log(`changed atem ${AtemNumber} source`)
			})
		}
	})
  ioHook.start()
}

startAtem('192.168.100.240', 0)
startAtem('169.254.152.19', 1)