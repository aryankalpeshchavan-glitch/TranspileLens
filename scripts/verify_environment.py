import sys
import importlib.util

def check_package(package_name):
    spec = importlib.util.find_spec(package_name)
    if spec is None:
        return f"{package_name}: NOT FOUND"
    try:
        module = importlib.import_module(package_name)
        version = getattr(module, "__version__", "unknown")
        return f"{package_name}: {version}"
    except Exception as e:
        return f"{package_name}: ERROR ({e})"

def main():
    print("Environment Diagnostic")
    print("----------------------")
    print(f"Python: {sys.version.split(' ')[0]}")
    
    packages = ["qiskit", "mqt.qcec", "numpy", "networkx", "scipy", "pytest", "pydantic"]
    for pkg in packages:
        print(check_package(pkg))

if __name__ == "__main__":
    main()
