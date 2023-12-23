import os
import shutil

def copy_all_txt_files(src_base_path, dest_base_path):
    if not os.path.exists(src_base_path):
        print(f"Source path does not exist: {src_base_path}")
        return

    if not os.path.exists(dest_base_path):
        os.makedirs(dest_base_path)

    for bug_id in os.listdir(src_base_path):
        src_folder_path = os.path.join(src_base_path, bug_id)
        dest_folder_path = os.path.join(dest_base_path, bug_id)

        if os.path.isdir(src_folder_path):
            if not os.path.exists(dest_folder_path):
                os.makedirs(dest_folder_path)

            src_file = os.path.join(src_folder_path, f"{bug_id}_all.txt")
            dest_file = os.path.join(dest_folder_path, "copy.txt")

            if os.path.exists(src_file):
                shutil.copy(src_file, dest_file)
                print(f"Copied {src_file} to {dest_file}")

def main():
    src_base_path = "/Users/jiachengding/PycharmProjects/google/bugreport"
    dest_base_path = "/Users/jiachengding/PycharmProjects/google/bugreportcopy"

    copy_all_txt_files(src_base_path, dest_base_path)

if __name__ == "__main__":
    main()

