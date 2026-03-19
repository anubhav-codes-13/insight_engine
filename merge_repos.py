import os
import shutil
import subprocess

# Paths
root = r"c:\Users\IN7934\Desktop\2026\March-2026\Insight_engine"
apps_dir = os.path.join(root, "apps")
temp_dir = os.path.join(root, "temp_move")

def run_git(cmd, cwd=root):
    print(f"Running: git {cmd}")
    subprocess.run(["git"] + cmd.split(), cwd=cwd, check=True)

def move_files_to_app(app_name, source_folders_to_ignore):
    target_app_dir = os.path.join(apps_dir, app_name)
    if not os.path.exists(target_app_dir):
        os.makedirs(target_app_dir)
        
    # List all top-level files and folders in root except common git ones and known repositories
    ignore = {".git", "apps", "README.md", "resolve-ai-innodata", "Insight_engine_backend", "backend_fronted_connector_files", ".gitignore", "merge_repos.py", "temp_move", ".gemini"}
    ignore.update(source_folders_to_ignore)
    
    for item in os.listdir(root):
        if item in ignore:
            continue
            
        full_path = os.path.join(root, item)
        target_path = os.path.join(target_app_dir, item)
        
        # If target already exists, skip it (this might happen with repeated merge files)
        if os.path.exists(target_path):
            if os.path.isdir(target_path):
                # Optionally merge folders, but for now we replace or skip
                continue
            else:
                os.remove(target_path)
                
        shutil.move(full_path, target_app_dir)

# 1. Fix the current mess (move things back to root first to be safe, except the genuine frontend files)
# Move Insight_engine_backend back to root if it's trapped in apps/frontend
trapped_backend = os.path.join(apps_dir, "frontend", "Insight_engine_backend")
if os.path.exists(trapped_backend):
    shutil.move(trapped_backend, root)
trapped_frontend_src = os.path.join(apps_dir, "frontend", "resolve-ai-innodata")
if os.path.exists(trapped_frontend_src):
    shutil.move(trapped_frontend_src, root)

# 2. Merge API (backend_fronted_connector_files)
try:
    run_git("remote add api-remote ./backend_fronted_connector_files")
except:
    pass
run_git("fetch api-remote")
run_git("merge api-remote/main --allow-unrelated-histories -m 'merge api history' --no-edit")
move_files_to_app("api", [])

# 3. Merge Backend (Insight_engine_backend)
try:
    run_git("remote add backend-remote ./Insight_engine_backend")
except:
    pass
run_git("fetch backend-remote")
run_git("merge backend-remote/main --allow-unrelated-histories -m 'merge backend history' --no-edit")
move_files_to_app("backend", [])

# 4. Final Cleanup
run_git("add .")
run_git("commit -m 'chore: finalizing monorepo merge for api and backend'")
print("DONE!")
