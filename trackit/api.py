import frappe

@frappe.whitelist()
def get_employee_id(user_id):
    employee_id = frappe.get_list("Employee",filters={ 'user_id' : user_id},fields=["name"]) 
    if employee_id :
        return employee_id[0].name

@frappe.whitelist()
def get_project_allocation(employee_id):
    project_list = frappe.get_all("Project Employee Allocation",
        filters={"employee_id" : employee_id},
        fields=["parent"])
    return project_list