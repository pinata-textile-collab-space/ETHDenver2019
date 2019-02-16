pragma solidity ^0.4.24;

contract Logger {

	mapping(address => string) public addressLookup;

	event LoggerEvent(
		address indexed EventSource,
		bytes32 indexed EventId,
		bytes32 indexed EventType,
		string  DataLink,
		bytes32 DataLinkType
	);

	function recordEvent(bytes32 _eventId, bytes32 _eventType, string _dataLink, bytes32 _dataLinkType) public returns(bool) {
		emit SiloEvent(msg.sender, _eventId, _eventType, _dataLink, _dataLinkType);
		return true;
	}

	function setAddressLookup(string _newLookupValue) public returns(bool) {
		addressLookup[msg.sender] = _newLookupValue;
		return true;
	}
}
