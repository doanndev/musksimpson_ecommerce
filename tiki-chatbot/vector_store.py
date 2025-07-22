import json
from sentence_transformers import SentenceTransformer
from typing import List, Dict
import chromadb
from connect_data import fetch_products
from datetime import datetime


class VectorStore:
    def __init__(self):
        self.model = SentenceTransformer(
            'paraphrase-multilingual-MiniLM-L12-v2')
        self.chroma_client = chromadb.PersistentClient(path="app/chroma_db")
        self.collection = self.chroma_client.get_or_create_collection(
            "products")

    def add_documents(self, documents: List[Dict]):
        """Add documents to the ChromaDB vector store"""
        texts = [
            "\n".join([f"{k}: {v}" for k, v in doc.items()])
            for doc in documents
        ]
        embeddings = self.model.encode(texts).tolist()
        ids = [str(doc['uuid']) for doc in documents]
        metadatas = documents

        # Xóa collection cũ nếu có (nếu muốn làm mới hoàn toàn)
        ids_to_delete = self.collection.get()['ids']
        if ids_to_delete:
            self.collection.delete(ids=ids_to_delete)

        BATCH_SIZE = 100
        for i in range(0, len(documents), BATCH_SIZE):
            self.collection.add(
                ids=ids[i:i + BATCH_SIZE],
                embeddings=embeddings[i:i + BATCH_SIZE],
                documents=texts[i:i + BATCH_SIZE],
                metadatas=metadatas[i:i + BATCH_SIZE]
            )

    def query(self, query_text: str, n_results: int = 10):
        """Query the ChromaDB vector store"""
        query_embedding = self.model.encode([query_text]).tolist()[0]
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
        metadata = results["metadatas"][0][0]
        if metadata.get("type") == "order":
            order_uuid = metadata.get("order_uuid")
            with open("app/data/order.json", "r", encoding="utf-8") as f:
                all_orders = json.load(f)
            order_items = [o for o in all_orders if o.get(
                "order_uuid") == order_uuid]
            # Gộp context lại thành 1 chuỗi text
            context = "\n".join([
                f"order_id: {item.get('order_id')}, status: {item.get('status')}, total_amount: {item.get('total_amount')}, product: {item.get('product_name')}, quantity: {item.get('quantity')}, item_total: {item.get('item_total')}"
                for item in order_items
            ])
            return {
                "documents": [[context]],  # Để main.py join đúng
                "metadatas": [order_items]
            }
        return {
            "documents": [results["documents"][0]],
            "metadatas": [results["metadatas"][0]]
        }

    def update_product(self, product: dict):
        # 1. Đọc file products.json
        with open("app/data/products.json", "r", encoding="utf-8") as f:
            products = json.load(f)
        # 2. Thêm sản phẩm mới vào list
        products.append(product)
        # 3. Ghi lại file
        with open("app/data/products.json", "w", encoding="utf-8") as f:
            json.dump(products, f, ensure_ascii=False, indent=2)
        # 4. Thêm vào ChromaDB
        text = "\n".join([f"{k}: {v}" for k, v in product.items()])
        embedding = self.model.encode([text]).tolist()
        self.collection.add(
            ids=[str(product['uuid'])],
            embeddings=embedding,
            documents=[text],
            metadatas=[product]
        )


def load_products():
    """Load products from database và ghi vào JSON file"""
    products = fetch_products()
    with open("app/data/products.json", "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    return products


def init_vector_store():
    """Initialize vector store with products"""
    vector_store = VectorStore()
    products = load_products()
    vector_store.add_documents(products)
    return vector_store


if __name__ == "__main__":
    # Test thêm 1 document
    vs = VectorStore()
    vs.add_documents([{
        "uuid": "test-1",
        "name": "Test Product",
        "description": "Mô tả test",
        "price": 100,
        "category": "Test",
        "attributes": "Color: Red"
    }])
    print("Done adding test document.")
