pragma solidity >=0.4.21 <0.6.0;

contract Logger {

    mapping(address => string) public addressLookup;

    event LoggerEvent(
        address indexed EventSource,
        uint256 indexed EventId,
        bytes32 indexed EventType,
        string  DataLink,
        bytes32 DataLinkType
    );

    function recordEvent(uint256 _eventId, bytes32 _eventType, string memory _dataLink, bytes32 _dataLinkType) public returns(bool) {
        emit LoggerEvent(msg.sender, _eventId, _eventType, _dataLink, _dataLinkType);
        return true;
    }

    function setAddressLookup(string memory _newLookupValue) public returns(bool) {
        addressLookup[msg.sender] = _newLookupValue;
        return true;
    }
}
