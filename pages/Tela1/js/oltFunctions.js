import states from './states.js'

async function checkSlots(ip, olt){
    const url = `${ip}` + `/olts/${olt.id}/slots` // Aqui a variavel url recebe normalmente: http://localhost:3000/olts/1/slots
    const response = await fetch(url)
    return await response.json(); // A variavel teste ta armezando todos os ids: http://localhost:3000/olts/todososids/slots

}

function addCorret_slots(slots, OLTId){ // #Temporaria - perda de desempenho porque está buscando todos os slots ou 
  var corretSlots = new Array ();
  for (const slot of slots){
    if (slot.OLTId == OLTId){
      corretSlots.push(slot)
    }
  }  
  return corretSlots
}

function add_slots(olt, slots){
    
  let tableSecondaryHead = `<tr>
    <td colspan="10" class="hiddenRow">
      <div class="collapse multi-collapse" id="${olt.OltID}">
        <table class="table table-bordered table-sm table-hover text-center">
          <thead>
            <tr>
              <th>Status</th>
              <th>Slot/Pons</th>
              <th>ONU Discovery</th>
              <th>ONU's Provisioned</th>
              <th>ONU's Online</th>
              <th>Options</th>
            </tr>
          </thead>
    <tbody>\n`
  
  let tableSecondaryTbody = ''
  for (const slot of slots){
    tableSecondaryTbody += `<tr data-toggle="collapse"  class="accordion-toggle" data-target="#demo10">
            <td>${slot.status}</td>
            <td>${slot.slot}</td>
            <td>${slot.OnuDiscovery}</td>
            <td>${slot.OnuProvisioned}</td>
            <td>${slot.OnuOnline}</td>
            <td>
              <span id="configIcon" class="clickIcon">
                <a>
                  <iconify-icon icon="vscode-icons:file-type-light-config" width="15" height="15"></iconify-icon>
                </a>
            </span>
      </td>`
  }
  tableSecondaryHead += `${tableSecondaryTbody}\n
                        </tbody>\n
                      </table>\n
                    </div>\n
                  </td>
                </tr>`

  return tableSecondaryHead;
}

async function add_olt(ipDB, olt){
  
  const name = olt.OltName;
  const ip = olt.ipAddress;
  const armario = olt.Armario;
  const powerdb = olt.PowerdB;
  const maxclients = olt.maxClients;
  let config = ''
  const id = olt.OltID;
  let statusClass = ''
  let rowSlots = ''
  
  if (states.checkStatus(olt.status) === 1){
    let sloters = await checkSlots(ipDB, olt);
    sloters = addCorret_slots(sloters, olt.id); // #Temporaria
    const oltSlots = add_slots(olt, sloters);
    statusClass = 'statusOnline';
    
    rowSlots = `\n ${oltSlots}
                  </tr>`
                  
    } else{
      statusClass = 'statusOffline';
    }
                
  let rowOLT = `<tr id="${statusClass}-${name}-${ip}">
                                      <th scope="row">
                                      <div class="${statusClass}" data-bs-toggle="collapse" href="#${id}" role="button" aria-expanded="false" aria-controls="${statusClass}-${ip}" ></div>
                                      </th>
                                  
                                      <td>${name}</td>
                                      <td>${armario}</td>
                                      <td>${powerdb}</td>
                                      <td>${maxclients}</td>
                                      <td>${ip}</td>
                                      <td>
                                          <span id="configIcon" class="clickIcon">
                                              <a class="dropdown-item" href="#" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#configModal">
                                                  <iconify-icon icon="vscode-icons:file-type-light-config" width="27" height="29"></iconify-icon>
                                              </a>
                                          </span>
                                      </td>
                                      <td>
                                          <span class="clickIcon clickDelete" onclick="deleteOlt('${statusClass}-${name}-${ip}')">
                                              <a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#modalRemove">
                                              <iconify-icon icon="bx:trash" width="27" height="29"></iconify-icon>
                                          </span>
                  </td>`
  
  rowOLT += rowSlots;
  const tabela = document.querySelector('table tbody');
  tabela.insertAdjacentHTML('beforeend', rowOLT);

}

function remove_olt(rmdata){
    const oltdata = rmdata.split('-', 3)
    
    const modal_remove = document.getElementById('modalRemove');
    modal_remove.querySelector('h5').innerHTML = "Deseja realmente remover a " + oltdata[1] + "?";
    const buttonConfirm = document.getElementById('buttonDeleteConfirm');
    buttonConfirm.setAttribute('onclick', `confirmRemove("${rmdata}")`)


}

function confirmRemove(data){
  const olt = document.getElementById(data)
  olt.remove()
}

export default { add_olt, remove_olt, checkSlots, confirmRemove };