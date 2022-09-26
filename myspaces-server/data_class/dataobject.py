# Version: python:3.8
#
# Name: dataobject.py
#
# Description: Reviews class file. Contains functions to interact with database interface
#
# Author: E. Omer Gul, Jasper Na


from abc import abstractmethod
from typing import List
from utility.db_interface import DBInterface
from utility.object_mapper import ObjectMapper
from utility.error_codes import ErrorCodes


class DataObject:

    RELATION_NAME: str
    ID_COL_NAME: str
    DO_NOT_ALTER_COLUMNS: List[str]

    def __init__(self):
        pass

    @abstractmethod
    def set_id(self, ID: int):
        pass

    @abstractmethod
    def get_id(self):
        pass

    # Inserts self object into the database
    # remove_id can be specified to remove the argument from the objects attribute dictionary
    #   This avoids inserting fake ID's into the database, instead DEFAULT will be assigned
    # Returning can be set in return a given attribute from the newly inserted database object
    #   This is useful returning the Object ID when DEFAULT is used
    def insert(self, remove_id: str = None, returning=None):
        returnedValue = None
        [colNames, valNames] = ObjectMapper.object_to_tuple(self, remove_id)
        errorCode, ListOfTupleOfReturnedValue = DBInterface().insert(
            self.RELATION_NAME, valNames, colNames, returning
        )
        if (
            errorCode == ErrorCodes.CODE_SUCCESS
            and ListOfTupleOfReturnedValue is not None
        ):
            returnedValue = ListOfTupleOfReturnedValue[0][0]
        return errorCode, returnedValue

    # Function takes a given DataObject and updates every value (Even if no change) in the database
    # Function requires all fields within the given DataObject to be set with true value (Otherwise placeholder values will be set)
    #   If not all attributes are given/known, then call @update_partial_object() below to perform a partial update
    def update_entire_object(
        self, object_id_where: str, remove_id: str = None
    ) -> tuple([int, object]):
        [col_names, val_names] = ObjectMapper.object_to_tuple(self, remove_id)
        set_val: str = col_names + "=" + val_names
        return DBInterface().update(self.RELATION_NAME, set_val, object_id_where)

    # Inserts based on given dictionary, rather than entire DataObject.
    # Use this function if you only wish to update some fields
    def update_partial_object(self, new_attributes: dict) -> tuple([int, object]):
        fields_to_update = self.compare_with(new_attributes)
        for itr in self.DO_NOT_ALTER_COLUMNS:
            fields_to_update.pop(itr, None)
        if len(fields_to_update) == 0:
            return ErrorCodes.CODE_NOTHING_TO_UPDATE, None
        [col_names, val_names] = ObjectMapper.dict_to_tuple(
            fields_to_update, remove_id=self.ID_COL_NAME
        )
        # Note: Update syntax requires parenthesis on multi-attr update, but parenthesis on singular
        #       attribute update will cause an error
        if len(fields_to_update) == 1:
            set_val: str = col_names[1:-1] + "=" + val_names[1:-1]
        else:
            set_val: str = col_names + "=" + val_names
        return DBInterface().update(
            self.RELATION_NAME,
            set_val,
            where_condition=f"{self.ID_COL_NAME}={self.get_id()}",
        )

    def delete_object(self):
        return DBInterface().delete(
            self.RELATION_NAME, f"{self.ID_COL_NAME} = {self.get_id()}"
        )

    # function compares current self state with older version.
    # items that have since changed will be returned in a difference dictionary
    def compare_with(old_version, new_dict: dict) -> dict:
        old_dict: dict = old_version.__dict__
        difference: dict = {}
        for key, value in new_dict.items():
            if not key in old_dict:
                print(
                    f"[ERR] {key} absent from old version dictionary. Inputs not well-formed."
                )
            else:
                if old_dict.get(key) != value:
                    difference[key] = value
        return difference

    # Returns corresponding Object from database based on object id, None otherwise
    # Returns Object if single tuple returned otherwise returns a List of Objects for multiple tuples
    @staticmethod
    def get_object(class_type, object_id_where):
        _, payload = DBInterface.select(
            DBInterface(), "*", class_type.RELATION_NAME, object_id_where
        )
        if payload == None or len(payload) < 1:
            return None
        elif len(payload) == 1:
            return ObjectMapper.tuple_to_object(class_type, payload[0])
        else:
            return ObjectMapper.tuples_to_list(class_type, payload)

    # function called by child class. Returns all tuples from corresponding child's database relation
    @staticmethod
    def get_all_objects(class_type, where=None):
        _, tuples = DBInterface.select(
            DBInterface(), "*", class_type.RELATION_NAME, where
        )
        return ObjectMapper.tuples_to_list(class_type, tuples)
