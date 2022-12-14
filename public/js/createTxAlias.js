const { PDFDocument, StandardFonts, rgb } = PDFLib

document.querySelector('#create').addEventListener('click', fillAndDownload)
document.querySelector('#viewPdf').addEventListener('click', fillAndView)

async function fill() {
    //Get form
    const url = getTemplate()
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())
    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    const form = pdfDoc.getForm()
  
    //Get the form fields
    const caseNumField = form.getTextField('caseNumber')
    const servee1AddField = form.getTextField('servee1')
    const servee2AddField = form.getTextField('servee2')
    const courtInfo = form.getTextField('courtInfo')
    const caseInfo = form.getTextField('caseInfo')
    const serviceType = form.getTextField('serviceType')
    const docReturnType = form.getTextField('docReturnType')
    const matterNum = form.getTextField('matterNumber')
    const generatedDate = form.getTextField('generateDate')
    const returnAddress = form.getTextField('returnAdd')
    const signature = form.getTextField('userName')
  
    //Fill out the form fields
    caseNumField.setText(getCaseNum())
    courtInfo.setText(`Clerk of the Court\n${getCounty()}, Texas\n${getCourtAddress()}`)
    caseInfo.setText(`${getPlaintiff()} vs. ${getDefendant()}; ${getCourt()}`)
    servee1AddField.setText(getServee1Info())
    servee2AddField.setText(getServee2Info())
    serviceType.setText(`Please issue a separate Citation for each defendant for service by a ${getServiceType()}.`)
    docReturnType.setText(await getDocReturnMethod())
    matterNum.setText(`Matter Number: ${getMatterNum()}`)
    generatedDate.setText(`Generated: ${getDate()}`)
    returnAddress.setText(await getLetterHeading())
    signature.setText(await getSignature())

    form.flatten()

    //Convert pdf to format viewable in an iframe
    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save()

    const returnPdf = [pdfDataUri, pdfBytes]
    return returnPdf
}

async function fillAndView() {
  const pdf = await fill()
  document.getElementById('pdfPreview').src = pdf[0];
}

async function fillAndDownload() {
  const pdfDoc = await fill()
  const pdfName = getMatterNum()

  // Trigger the browser to download the PDF document
  download(pdfDoc[1], `${pdfName} let`, "application/pdf");
}

//Helper function to get value from a form
function getFormValue(selector) {
  return document.querySelector(selector).value
}

//Helper function to parse court name
function splitAtNewLineAndTrim(selector) {
  return getFormValue(selector).split('\n').map(string => string.trim())
}

//Helper function to get template's cloudinary url
function getTemplate() {
  return getFormValue('#txAliasTemplate')
}

//Helper functions to get party info
function getPlaintiff() {
  return getFormValue('#plaintiffName').toUpperCase()
}

function getDefendant() {
  return getFormValue('#defendantName').toUpperCase()
}

function getServee1Info() {
  const serveeAddress = getFormValue('#servee1Address').toUpperCase()
  const serveeName = getFormValue(`#servee1Name`).toUpperCase()
  return `${serveeName}\n${serveeAddress}`
}

function getServee2Info() {
  const serveeAddress = getFormValue('#servee2Address').toUpperCase()
  const serveeName = getFormValue('#servee2Name').toUpperCase()
  return `${serveeName}\n${serveeAddress}` 
}

//Helper functions to get Case Info
function getMatterNum() {
  return getFormValue('#matterNumber')
}

function getCaseNum() {
  return getFormValue('#caseNum').toUpperCase()
}

function getCourtInfo() {
  return getFormValue('#courtInfo')
}

function getCounty() {
  const courtInfo = splitAtNewLineAndTrim('#courtInfo')
  const court = courtInfo[0].split('for')
  const county = court[1].trim()
  return county
}

function getCourt() {
  const courtInfo = splitAtNewLineAndTrim('#courtInfo')
  return courtInfo[0]
}

function getCourtAddress() {
  const courtInfo = splitAtNewLineAndTrim('#courtInfo')
  const courtAddress = courtInfo.slice(1).join('\n')
  return courtAddress
}

//Helper functions to get misc form info
function getServiceType() {
  return getFormValue('#txServiceType')
}

async function getDocReturnMethod() {
  const serviceType = getFormValue('#txServiceType')
  const returnMethod = getFormValue('#txDocReturnMethod')
  const id = getFormValue('#customerEmail')
  let email = ""
  try {
    if (id !== "") {
      const res = await fetch(`/customer/email/${id}`)
      const data = await res.json()
      email = data[0].email
    }
    if (serviceType === 'sheriff' || serviceType === 'constable') {
      return `Dispatch all documents to the ${serviceType} for service`
    } else if (returnMethod === 'Email to ') {
        return `${returnMethod}${email}`
    } else if (returnMethod === 'Mail to ') {
        const userId = document.querySelector('#create').dataset.userid
        const user = await fetch(`/user/info/${userId}`)
        const data = await user.json()
        // const address = data[0].returnAddress.split('\r\n').join(' ')
        const address2 = data[0].address2
        const address = (address2 === '') ? `${data[0].address1}, ${data[0].city}, ${data[0].state} ${data[0].zip}` : `${data[0].address1}, ${data[0].address2}, ${data[0].city}, ${data[0].state} ${data[0].zip}`
        return `${returnMethod}${address}`
    } else {
      return `${returnMethod}`
    }
    
  } catch (err) {
    console.log(err)
  }
}

async function getLetterHeading() {
  try {
    const userId = document.querySelector('#create').dataset.userid
    const user = await fetch(`/user/info/${userId}`)
    const data = await user.json()
    const business = data[0].businessName
    // const address = data[0].returnAddress.split('\r\n').join('\n')
    const address2 = data[0].address2
    const address = (address2 === '') ? `${data[0].address1}, ${data[0].city}, ${data[0].state} ${data[0].zip}` : `${data[0].address1}, ${data[0].address2}, ${data[0].city}, ${data[0].state} ${data[0].zip}`
    const additionalHeading = data[0].letterHeading.split('\r\n').join('\n')
    return `${business}\nAddress: ${address}\n${additionalHeading}`
  } catch (err) {
    console.log(err)
  }
}

async function getSignature() {
  try {
    const userId = document.querySelector('#create').dataset.userid
    const user = await fetch(`/user/info/${userId}`)
    const data = await user.json()
    const business = data[0].businessName
    return `${business}`
  } catch (err) {
    console.log(err)
  }
}

function getDate() {
  return new Date().toLocaleDateString()
}

/*Clear form fields*/
document.querySelector('#resetTxLetForm').addEventListener('click', clearFields)

function clearFields() {
  document.querySelector('#courtInfo').value = ""
  document.querySelector('#matterNumber').value = ""
  document.querySelector('#caseNum').value = ""
  document.querySelector('#plaintiffName').value = ""
  document.querySelector('#defendantName').value = ""
  document.querySelector('#servee1Name').value = ""
  document.querySelector('#servee1Address').value = ""
  document.querySelector('#servee2Name').value = ""
  document.querySelector('#servee2Address').value = ""
  document.querySelector('#txServiceType').value = "choose"
  document.querySelector('#txDocReturnMethod').value = "choose"
  document.querySelector('#customerEmail').value = "choose"
  document.querySelector('#txAliasTemplate').value = ""
}

/* filter form fields */
let $serviceMethod = $( '#txServiceType' );
let $returnMethod = $( '#txDocReturnMethod' );
let $returnOptions = $returnMethod.find( 'option' );
let $emailSelect = $( '#customerEmail');
let $emailOptions = $emailSelect.find( 'option' );
    
$serviceMethod.on( 'change', function() {
    if (this.value === 'constable') {
        $returnMethod.html( $returnOptions.filter( '[data-dep="' + 'sheriff' + '"]' ) );
        $emailSelect.html( $emailOptions.filter( '[data-dep="' + 'sheriff' + '"]' ) );
    } else if (this.value === 'sheriff') {
        $returnMethod.html( $returnOptions.filter( '[data-dep="' + this.value + '"]' ) );
        $emailSelect.html( $emailOptions.filter( '[data-dep="' + this.value + '"]' ) );
    } else {
        $returnMethod.html( $returnOptions.filter( '[data-dep="' + this.value + '"]' ) );
    }
}).trigger( 'change' );

$returnMethod.on( 'change', function() {
    if (this.value === 'Email to ' || this.value === 'choose') {
        $emailSelect.html( $emailOptions.filter( '[data-dep="' + this.value + '"]' ) );
    } else {
        $emailSelect.html( $emailOptions.filter( '[data-dep="' + 'sheriff' + '"]' ) );
    }
}).trigger( 'change' );