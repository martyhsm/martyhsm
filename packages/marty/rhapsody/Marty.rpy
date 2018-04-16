I-Logix-RPY-Archive version 8.5.2 Modeler C++ 1159120
{ IProject 
	- _id = GUID 3807f6b3-e035-4329-b609-d8963e0e8710;
	- _myState = 8192;
	- _name = "Marty";
	- _objectCreation = "539234514201623216581253";
	- _umlDependencyID = "2115";
	- _lastID = 2;
	- _UserColors = { IRPYRawContainer 
		- size = 16;
		- value = 16777215; 16777215; 16777215; 16777215; 16777215; 16777215; 16777215; 16777215; 16777215; 16777215; 16777215; 16777215; 16777215; 16777215; 16777215; 16777215; 
	}
	- _defaultSubsystem = { ISubsystemHandle 
		- _m2Class = "ISubsystem";
		- _filename = "Default.sbs";
		- _subsystem = "";
		- _class = "";
		- _name = "Default";
		- _id = GUID fe1e284e-a27f-470d-bef0-b0f6c1373193;
	}
	- _component = { IHandle 
		- _m2Class = "IComponent";
		- _filename = "DefaultComponent.cmp";
		- _subsystem = "";
		- _class = "";
		- _name = "DefaultComponent";
		- _id = GUID 179362c8-6883-4af8-b7dc-a0450b245511;
	}
	- Multiplicities = { IRPYRawContainer 
		- size = 4;
		- value = 
		{ IMultiplicityItem 
			- _name = "1";
			- _count = -1;
		}
		{ IMultiplicityItem 
			- _name = "*";
			- _count = -1;
		}
		{ IMultiplicityItem 
			- _name = "0,1";
			- _count = -1;
		}
		{ IMultiplicityItem 
			- _name = "1..*";
			- _count = -1;
		}
	}
	- Subsystems = { IRPYRawContainer 
		- size = 3;
		- value = 
		{ ISubsystem 
			- fileName = "Default";
			- _id = GUID fe1e284e-a27f-470d-bef0-b0f6c1373193;
		}
		{ ISubsystem 
			- fileName = "Marty";
			- _id = GUID e52d6d05-3794-4a2a-b7b4-9873b6ba16a2;
		}
		{ ISubsystem 
			- fileName = "FSM";
			- _id = GUID 24559251-5f13-407b-9bd2-42a0d9f4e742;
		}
	}
	- Diagrams = { IRPYRawContainer 
		- size = 0;
	}
	- Components = { IRPYRawContainer 
		- size = 1;
		- value = 
		{ IComponent 
			- fileName = "DefaultComponent";
			- _id = GUID 179362c8-6883-4af8-b7dc-a0450b245511;
		}
	}
}

