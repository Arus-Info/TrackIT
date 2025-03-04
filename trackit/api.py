import frappe

@frappe.whitelist()
def get_employee_id(user_id):
    employee_id = frappe.get_list("Employee",filters={ 'user_id' : user_id},fields=["name"]) 
    if employee_id :
        return employee_id[0].name

@frappe.whitelist()
def get_project_allocation(employee_id):
    project_list = frappe.db.sql("""
        select pai.project_name
        from `tabEmployee Allocation Instruction` as  eai
        left join `tabProject Allocation and Instrucions` as  pai on eai.parent = pai.name
        where eai.employee = %(employee_id)s 
        """,{"employee_id" : employee_id},as_dict = True)
    return project_list


@frappe.whitelist()
def upload_base64_file(content, filename, dt=None, dn=None, fieldname=None):
    import base64
    import io
    from mimetypes import guess_type

    from PIL import Image, ImageOps

    from frappe.handler import ALLOWED_MIMETYPES

    decoded_content = base64.b64decode(content)
    content_type = guess_type(filename)[0]
    if content_type not in ALLOWED_MIMETYPES:
        frappe.throw(_("You can only upload JPG, PNG, PDF, TXT or Microsoft documents."))

    if content_type.startswith("image/jpeg"):
        # transpose the image according to the orientation tag, and remove the orientation data
        with Image.open(io.BytesIO(decoded_content)) as image:
            transpose_img = ImageOps.exif_transpose(image)
            # convert the image back to bytes
            file_content = io.BytesIO()
            transpose_img.save(file_content, format="JPEG")
            file_content = file_content.getvalue()
    else:
        file_content = decoded_content

    return frappe.get_doc(
        {
            "doctype": "File",
            "attached_to_doctype": dt,
            "attached_to_name": dn,
            "attached_to_field": fieldname,
            "folder": "Home",
            "file_name": filename,
            "content": file_content,
            "is_private": 0,
        }
    ).insert()

@frappe.whitelist()
def get_work_time_settings():
    return frappe.get_single("Work Time Settings")

@frappe.whitelist(allow_guest = True)
def get_header_info():
    app_logo = frappe.get_single("Navbar Settings").app_logo
    company = frappe.get_single("Global Defaults").default_company
    return app_logo,company