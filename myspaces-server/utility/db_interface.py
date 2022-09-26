# Version: python:3.8
#
# Name: db_interface.py
#
# Description: This file provides an interface to interact with the database.
#
# Author: E. Omer Gul, Jasper Na

import psycopg2
import os
from psycopg2 import errors as psycoErr
from dotenv import load_dotenv
import re

from utility.error_codes import ErrorCodes


class DBInterface:
    def __init__(self):
        self.conn = None
        print("New DB Interface created")

    # Function connects to PostgreSQL database
    def connect_to_db(self):
        try:
            load_dotenv()  # load environment variables
            if not self.conn:
                self.conn = psycopg2.connect(
                    f"dbname={os.environ.get('POSTGRES_DB')} user={os.environ.get('POSTGRES_USER')} password={os.environ.get('POSTGRES_PASSWORD')} host=pg-database"
                )
                print(f"Successfully connect to {self.conn}")
        except Exception as e:
            print(f"[ERR] Unable to connect to the database {e}.")

    # SQL INSERT
    # the INSERT statement is used to insert new records into the database
    # Function formats a valid PGSQL INSERT command
    # Note: Values must be format "(foo, bar)"
    #       Columns (if req) must be format "(foo_col, bar_col)"
    def insert(self, target_table, values, columns=None, returning=None):
        if not re.search("^(.+)$", values):
            print('[ERR] given values must have enclosing parenthesis "(foo, bar)"')
            return
        if columns and not re.search("^(.+)$", columns):
            print('[ERR] given columns must have enclosing parenthesis "(foo, bar)"')
            return

        if columns:
            query_string = f"INSERT INTO {target_table} {columns} VALUES {values}"
        else:
            query_string = f"INSERT INTO {target_table} VALUES {values}"
        if returning:
            query_string = query_string + f" RETURNING {returning}"

        f = open("cache_inserts.txt", "a")
        f.write(f"{query_string};\n")
        f.close()

        return self.execute(query_string, commit=True, fetch=(returning != None))

    # SQL SELECT
    # the SELECT statement is used to return objects from the database
    # Function formats a valid PGSQL SELECT command
    def select(self, what, target_table, where=None):
        query_string = f"SELECT {what} FROM {target_table}"
        if where:
            query_string = query_string + f" WHERE {where}"
        return self.execute(query_string, fetch=True)

    # SQL UPDATE
    # allows tuple updation in on target_table within database
    # Function formats a valid PGSQL UPDATE command
    def update(self, target_table, set_values, where_condition) -> tuple([int, object]):
        query_string = (
            f"UPDATE {target_table} SET {set_values} WHERE {where_condition};"
        )
        return self.execute(query_string, commit=True)

    # SQL DELETE
    # Delete statements remove records from the database
    # Function formats a valid PGSQL DELETE command
    def delete(self, target_table, where_condition) -> tuple([int, None]):
        query_string = f"DELETE from {target_table} WHERE {where_condition}"
        return self.execute(query_string, commit=True)

    # Execute function executes an SQL command specified by the query_string.
    # The squery string should be corrctly formatted by corresponding functions above
    # If commit is true, then changes to the database will be perminant (Should be set true on INSERT, DELETE, UPDATE)
    #   SELECT statements do not require changes to be commit
    # If fetch is specified then the call to the database is expected to return something. The result of fetchall will be returned.
    # Execute returns an error code (CODE_SUCCESS if none), and correpsonding returned payload (If expected, None otherwise)
    def execute(
        self, query_string: str, commit=False, fetch=False
    ) -> tuple([int, object]):
        try:
            print(f"Executing: {query_string}")
            ret = None
            self.connect_to_db()  # ensure connected to DB
            cur = self.conn.cursor()  # get the DB cursor
            cur.execute(query_string)  # execute command
            if fetch == True:
                ret = cur.fetchall()  # get all resulting tuples (If any)
            if commit == True:
                self.conn.commit()  # make persistent changes if required
            # close cursor
            cur.close()

            if fetch == True and len(ret) < 1:
                return ErrorCodes.CODE_NO_RESULTS, None
            else:
                return ErrorCodes.CODE_SUCCESS, ret
            # return True, ret # True, "all clear :)" # state and message for flawless execution

        except psycoErr.UniqueViolation as e:
            print("Unique value violation")
            error_code = ErrorCodes.psycopg2_expection_handler(e)
            return error_code, None
            # listoftupleofreturnedvalue = [(False,),msg]
            # return False,None # this is done to match the format of ret. The function expecting this return will unpack and deal with contents
        except psycoErr.CheckViolation as e:
            print("Check Violation")
            error_code = ErrorCodes.psycopg2_expection_handler(e)
            return error_code, None

        except Exception as e:
            print(f"[ERR] Error occured trying to execute [{query_string}]:{e}.")
            return ErrorCodes.CODE_FAILURE, None

    def __del__(self):
        if self.conn:
            try:
                self.conn.close()
                print(f"Successfully disconnected from {self.conn}")
            except Exception as e:
                print(f"[ERR] Destructor Error {e}.")
