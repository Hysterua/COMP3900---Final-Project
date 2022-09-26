# Version: python:3.8
#
# Name: object_mapper.py
#
# Description: Class is responsible to mapping raw data tuples into corresponding data objects
#
# Author: Jasper Na
#
# Note: classmethod must have a reference to a class object as the first parameter, whereas staticmethod can have no parameters at all.


class ObjectMapper:

    # Convert a dataobject object into corresponding database tuple representation
    # if remove_id is specified, then pass in string will be removed from tuple (Needed upon insert into DB)
    # function returns DB column names and DB tuple values
    @staticmethod
    def object_to_tuple(obj, remove_id: str = None):
        return ObjectMapper.dict_to_tuple(obj.__dict__, remove_id)

    @staticmethod
    def dict_to_tuple(target: dict, remove_id: str = None):
        if remove_id:
            target.pop(remove_id, None)
        # database column names
        db_columns = "(" + ",".join(target.keys()) + ")"

        # Need to escape any single quotation before insertion into database
        escaped_string = lambda x: x.replace("'", "''") if type(x) is str else x
        target = list(map(escaped_string, target.values()))

        # lambda wraps strings with '' for valid insertion
        wrap_string = lambda x: f"'{x}'" if type(x) is str else str(x)
        db_values = "(" + ",".join(map(wrap_string, target)) + ")"
        return db_columns, db_values

    @staticmethod
    # function converts a list of tuples into a list of corresponding objects
    # object_class argument is a DataObject class specified from ../data_class
    def tuples_to_list(object_class, tuples: list):
        try:
            new_list = []
            for tuple in tuples:
                new_list.append(ObjectMapper.tuple_to_object(object_class, tuple))
            return new_list
        except Exception as e:
            print(f"Unable to convert tuples to corresponding object class dictionary")

    @staticmethod
    # function converts a raw returned data tuple back to corresponding object class
    def tuple_to_object(object_class, tuple: tuple):
        try:
            return object_class(*tuple)
        except Exception as e:
            print(f"[ERR] Unable to convert tuple {tuple} into class. {e}.")
