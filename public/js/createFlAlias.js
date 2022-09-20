const { PDFDocument, StandardFonts, rgb } = PDFLib

document.querySelector('#create').addEventListener('click', fillForm)

async function fillForm() {
  //Get form
  const url = getTemplate()
  const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())
  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  const form = pdfDoc.getForm()

  //Get the form fields
  const caseNumField = form.getTextField('caseNumber')
  const matterNum = form.getTextField('matterNumber')
  const plaintiff = form.getTextField('plaintiff')
  const defendant = form.getTextField('defendant')
  const servee = form.getTextField('servee')
  const summonsTitle = form.getTextField('summonsTitle')
  const customer = form.getTextField('customer')

  const customerText = await getCustomerInfo()

  //Fill out the form fields
  caseNumField.setText(`Case No. ${getCaseNum()}`)
  matterNum.setText(`Matter Number: ${getMatterNum()}`)
  plaintiff.setText(getPlaintiff())
  defendant.setText(getDefendant())
  servee.setText(getServeeInfo())
  summonsTitle.setText(getSummonsTitle())
  customer.setText(`${customerText}`)

  // form.flatten()

  //Convert pdf to format viewable in an iframe and display in iframe
  const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
  document.getElementById('pdfPreview').src = pdfDataUri;

  // Serialize the PDFDocument to bytes (a Uint8Array)
  //const pdfBytes = await pdfDoc.save()

  // Trigger the browser to download the PDF document
  //download(pdfBytes, "pdf-lib_form_creation_example.pdf", "application/pdf");

}

//Helper function to get value from a form
function getFormValue(selector) {
  return document.querySelector(selector).value
}

//Helper function to get template's cloudinary url
function getTemplate() {
  return getFormValue('#tierInfo')
}

//Helper functions to get party info
function getPlaintiff() {
  return getFormValue('#plaintiffName').toUpperCase()
}

function getDefendant() {
  return getFormValue('#defendantName').toUpperCase()
}

function getServeeInfo() {
  const serveeAddress = getFormValue('#serveeAddress').toUpperCase()
  const serveeName = getFormValue(`#serveeName`).toUpperCase()
  return `${serveeName}\n${serveeAddress}`
}

//Helper functions to get Case Info
function getMatterNum() {
  return getFormValue('#matterNumber')
}

function getCaseNum() {
  return getFormValue('#caseNum').toUpperCase()
}

//Helper functions to get misc form info
function getSummonsTitle() {
    const prefix = getFormValue('#summonsTitle')
    if (prefix === 'Initial') {
        return ''
    } else if (prefix === 'Alias') {
        return 'ALIAS'
    } else if (prefix === 'Pluries') {
        const pluriesNumber = getFormValue('#pluriesNum')
        const pluriesNumberDigits = pluriesNumber.split('')
        const lastDigit = pluriesNumberDigits[pluriesNumberDigits.length - 1]
        let order = ''
        if (pluriesNumber === '11' || pluriesNumber === '12' || pluriesNumber === '13') {
            order = pluriesNumber + 'TH'
        } else if (lastDigit === '1') {
            order = pluriesNumber + 'ST'
        } else if (lastDigit === '2') {
            order = pluriesNumber + 'ND'
        } else if (lastDigit === '3') {
            order = pluriesNumber + 'RD'
        } else if (pluriesNumber.length === 0) {
            order = ''
        } else {
            order = pluriesNumber + 'TH'
        }
        return `${order} PLURIES`
    }
}

async function getCustomerInfo() {
    try {
        const id = getFormValue('#customerName')
        const res = await fetch(`/customer/email/${id}`)
        const data = await res.json()
        if (data[0].address2 !== '') {
            return `Plaintiff's Attorney:\n${data[0].customerName}\n${data[0].address1}, ${data[0].address2}, ${data[0].city}, ${data[0].state} ${data[0].zip}`
        } else {
            return `Plaintiff's Attorney:\n${data[0].customerName}\n${data[0].address1}, ${data[0].city}, ${data[0].state} ${data[0].zip}`
        }
        
    } catch(err) {
        console.log(err)
    }

}


/*Clear form fields*/
document.querySelector('#resetForm').addEventListener('click', clearFields)

function clearFields() {
  document.querySelector('#countyInfo').value = ""
  document.querySelector('#tierInfo').value = ""
  document.querySelector('#matterNumber').value = ""
  document.querySelector('#caseNum').value = ""
  document.querySelector('#plaintiffName').value = ""
  document.querySelector('#defendantName').value = ""
  document.querySelector('#serveeName').value = ""
  document.querySelector('#serveeAddress').value = ""
  document.querySelector('#summonsTitle').value = ""
  document.querySelector('#pluriesNum').value = ""
  document.querySelector('#customerName').value = ""
}