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
  const summonsTitle = form.getTextField('Text6')
//   if (form.getTextField('customerName')) {
//     const customer = form.getTextField('customerName')
//     customer.setText(`${getCustomerInfo()}`)
//   }

  //Fill out the form fields
  caseNumField.setText(`Case Number: ${getCaseNum()}`)
  matterNum.setText(`Matter Number: ${getMatterNum()}`)
  plaintiff.setText(getPlaintiff())
  defendant.setText(getDefendant())
  servee.setText(getServeeInfo())
  summonsTitle.setText(getSummonsTitle())

//   courtInfo.setText(`Clerk of the Court\n${getCounty()}, Texas\n${getCourtAddress()}`)
//   caseInfo.setText(`${getPlaintiff()} vs. ${getDefendant()}; ${getCourt()}`)
//   servee1AddField.setText(getServee1Info())
//   servee2AddField.setText(getServee2Info())
//   serviceType.setText(`Please issue a separate Citation for each defendant for service by a ${getServiceType()}.`)
//   docReturnType.setText(await getDocReturnMethod())
//   generatedDate.setText(`Generated: ${getDate()}`)
//   returnAddress1.setText(`${getFormValue('#retAdd1').split('**').map(str => str.trim()).join('\n')}`)
//   returnAddress2.setText(`${getFormValue('#retAdd2').split('**').map(str => str.trim()).join('\n')}`)
//   signature.setText(`${getFormValue('#signature')}`)

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
    } else {
        return returnMethod
    }
    
  } catch (err) {
    console.log(err)
  }
}

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
        return `${data[0].customerName}\n${data[0].email}`
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