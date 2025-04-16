import pandas as pd
import matplotlib.pyplot as plt
import argparse
import os

# Creates a chart, that you can save to computer etc.

def load_data(csv_path):
    df = pd.read_csv(csv_path)
    return df

def analyze_algorithm_distribution(df):
    algo_counts = df['algorithm'].value_counts().sort_index()
    plt.figure(figsize=(18, 6))
    algo_counts.plot(kind='bar', color='skyblue')
    plt.title("DX7 Algorithm Usage Distribution") # here name of the csv?
    plt.xlabel("Algorithm Number")
    plt.ylabel("Number of Patches")
    plt.xticks(rotation=90)
    plt.grid(axis='y')
    plt.tight_layout()
    #output_path = os.path.join(output_dir, "algorithm_distribution.png")
    #plt.savefig(output_path)
    #print(f"Saved chart: {output_path}")
    plt.show()

def main():
    parser = argparse.ArgumentParser(description="Analyze DX7 patch data")
    parser.add_argument("csv", help="Path to CSV file")
    parser.add_argument("--output", default="charts", help="Output directory for charts")
    args = parser.parse_args()

    os.makedirs(args.output, exist_ok=True)

    df = load_data(args.csv)
    analyze_algorithm_distribution(df)

if __name__ == "__main__":
    main()