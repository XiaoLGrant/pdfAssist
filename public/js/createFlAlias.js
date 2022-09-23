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

  //Get and fill out court address form field if county is Miami-Dade -- will need to update to specify filing tier & other counties (broward) in the future
  if ( document.querySelector('#countyInfo').value == 'Miami-Dade' ) {
    const courtAddress = form.getTextField('courtAddress')
    courtAddress.setText(`${await getCourtAddress()}`)
  }

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

async function getCourtAddress() {
  try {
    const county = getFormValue('#countyInfo')
    const tier = $( "#tierInfo" ).find('option:selected').data("tier")
    if ( county == 'Miami-Dade' && tier == 'cc' ) {
      const caseNumber = getFormValue('#caseNum')
      const division = '' + caseNumber.slice(-2)
      let address = ''
      switch(division) {
        case '05':
          address = 'Dade County Courthouse (05)\nRoom 133\n73 West Flagler Street\nMiami, FL 33130';
          break;
        case '20':
          address = 'Joseph Caleb Center Court (20)\nSuite 103\n5400 N.W. 22nd Avenue\nMiami, FL 33142';
          break;
        case '21':
          address = 'Hialeah District Court (21)\nRoom100\n11 East 6th Street\nHialeah, Florida 33010';
          break;
        case '23':
          address = 'North Dade Justice Center (23)\nRoom100\n15555 Biscayne Blvd.\nNorth Miami Beach, FL 33160';
          break;
        case '24':
          address = 'Miami Beach District Court (24)\nRoom 200\n1130 Washington Avenue\nMiami Beach, FL 33139';
          break;
        case '25':
          address = 'Coral Gables District Court (25)\nRoom 100\n3100 Ponce de Leon Blvd.\nCoral Gables, Florida 33134';
          break;
        case '26':
          address = 'South Dade Justice Center (26)\nRoom 1200\n10710 SW 211 Street\nMiami, FL 33189';
          break;
      }
      return address
    } else if ( county == 'Broward' && tier == 'cc' ) {
      const caseNumber = getFormValue('#caseNum')
      const division = caseNumber.slice(0, 4)
      let address = ''
      switch(division) {
        case 'COCE':
          address = 'Broward County Central Courthouse\n201 SE 6th Street\nFort Lauderdale, FL 33301';
          break;
        case 'CONO':
          address = 'Broward North Regional Courthouse\n1600 W Hillsboro Blvd\nDeerfield Beach, FL 33442';
          break;
        case 'COWE':
          address = 'Broward West Regional Courthouse\n100 N Pine Island Rd\nPlantation, FL 33317';
          break;
        case 'COSO':
          address = 'Broward South Regional Courthouse\n3550 Hollywood Blvd\nHollywood, FL 33021';
          break;
        case 'CACE':
          address = 'Broward County Central Courthouse\n201 SE 6th Street\nFort Lauderdale, FL 33301';
          break;
      }
      return address
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

/* Filter drop downs*/
let $county = $( '#countyInfo' )
let $tier = $( '#tierInfo' )
let $options = $tier.find( 'option' );
    
$county.on( 'change', function() {
    $tier.html( $options.filter( '[data-dep="' + this.value + '"]' ) );
} ).trigger( 'change' );