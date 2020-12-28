const modes = [
    {
        "name": "LSB",
        "id": 0
    }, 
    {
        "name": "USB",
        "id": 1
    }, 
    {
        "name": "CW",
        "id": 2
    }, 
    {
        "name": "CWR",
        "id": 3
    }, 
    {
        "name": "AM",
        "id": 4
    }, 
    {
        "name": "WFM",
        "id": 6
    }, 
    {
        "name": "FM",
        "id": 8
    }, 
    {
        "name": "DIG",
        "id": 10
    }, 
    {
        "name": "PKT",
        "id": 12
    }, 
    
]


exports.getModeNameById = (mode) => {
    let id = parseInt(mode, 16)
    let mode_obj = modes.find(ms => ms.id === id)
    return mode_obj.name
}